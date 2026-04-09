import { ApiClient } from "../model/ApiClient.js";
import { AccountSwitcher } from "../view/pages/AccountSwitcher.js";

export class AuthController {
    constructor(app) {
        this.app = app;
    }

    handleInput(mode, field, value) {
        this.app.model.updateAuthData(mode, field, value);

        if (
            this.app.view.currentPage &&
            typeof this.app.view.currentPage.refreshBtn === "function"
        ) {
            this.app.view.currentPage.refreshBtn();
        }
    }

    handleInstrumentSelect(instrumentId) {
        this.app.model.updateAuthData(
            "register-child",
            "instrument",
            instrumentId,
        );

        if (
            this.app.view.currentPage &&
            typeof this.app.view.currentPage.refreshInstrumentSelection ===
                "function"
        ) {
            this.app.view.currentPage.refreshInstrumentSelection();
        }
    }

    handleMascotSelect(mascot) {
        this.app.model.updateAuthData("register-child", "mascot", mascot);

        if (
            this.app.view.currentPage &&
            typeof this.app.view.currentPage.refreshMascotSelection ===
                "function"
        ) {
            this.app.view.currentPage.refreshMascotSelection();
        }
    }

    handleDayToggle(day) {
        this.app.model.toggleRegisterDay(day);

        if (
            this.app.view.currentPage &&
            typeof this.app.view.currentPage.refreshDaysSelection === "function"
        ) {
            this.app.view.currentPage.refreshDaysSelection();
        }
    }

    async submitLogin() {
        const state = this.app.model.getAuthState();
        if (state.isLoading) return;

        this.app.model.setLoading(true);
        this.triggerRender();

        try {
            const result = await ApiClient.post(`/auth/login`, {
                email: state.loginData.email,
                password: state.loginData.password,
            });

            if (!result || result.error || !result.token) {
                throw new Error(result?.error || "Server error");
            }

            this.app.model.session.saveSession({
                token: result.token,
                adultId: result.adultId,
                childId: result.childId,
            });

            this.app.model.setLoading(false);

            if (this.app.model.session.isParent()) {
                this.app.navigation.goTo("parent-home");
            } else {
                await this.app.child.loadChildData();
                this.app.navigation.goTo("home");
            }
        } catch (err) {
            this.app.model.setLoading(false);
            this.triggerRender();
        }
    }

    async forgotPassword(email) {
        try {
            const result = await ApiClient.post(`/auth/forgot-password`, {
                email,
            });
            if (result && result.error) throw new Error(result.error);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async resetPassword(newPassword) {
        const token = this.app.model.getResetToken();
        try {
            const result = await ApiClient.post(`/auth/reset-password`, {
                token,
                newPassword,
            });
            if (result && result.error) throw new Error(result.error);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async handleNextStep(type) {
        const state = this.app.model.getAuthState();
        const step = state.step || 1;

        const isParent = type === "parent";
        const maxStep = isParent ? 2 : 7;

        if (step < maxStep) {
            this.app.model.setAuthStep(step + 1);
            this.triggerRender();
        } else {
            if (isParent) {
                await this.submitParentRegistration();
            } else {
                await this.submitChildRegistration();
            }
        }
    }


    async submitParentRegistration() {
        const state = this.app.model.getAuthState();
        if (state.isLoading) return;

        this.app.model.setLoading(true);
        this.triggerRender();

        try {
            const result = await ApiClient.post(`/auth/register-adult`, {
                email: state.registerData.email,
                password: state.registerData.password,
                pin: state.registerData.pin,
            });

            if (!result || result.error || (!result.token && !result.adultId)) {
                throw new Error(result?.error || "Registration error");
            }

            this.app.model.session.saveSession({
                token: result.token,
                adultId: result.userId || result.adultId,
            });

            this.app.model.setLoading(false);
            this.app.navigation.goTo("parent-home");
        } catch (err) {
            this.app.model.setLoading(false);
            this.triggerRender();
        }
    }

    async handleSwitchToParent() {
        try {
            const profile = await ApiClient.get("/auth/profile");

            if (profile && profile.hasPin) {
                AccountSwitcher.showPinPopup(
                    async (enteredPin, onSuccess, onError) => {
                        try {
                            const res = await ApiClient.post(
                                "/auth/verify-pin",
                                {
                                    pin: enteredPin,
                                },
                            );
                            if (res.success) {
                                onSuccess();
                                this.executeSwitchToParent();
                            } else {
                                onError();
                            }
                        } catch (e) {
                            onError();
                        }
                    },
                );
            } else {
                this.executeSwitchToParent();
            }
        } catch (err) {
            console.error("Switch to parent mode error :", err);
        }
    }

    executeSwitchToParent() {
        this.app.model.session.clearActiveChild();
        this.app.navigation.goTo("parent-home");
    }

    async submitChildRegistration() {
        const state = this.app.model.getAuthState();
        if (state.isLoading) return;

        this.app.model.setLoading(true);
        this.triggerRender();

        try {
            const payload = {
                name: state.childRegisterData.name ?? null,
                age: parseInt(state.childRegisterData.age) || null,
                instrument: state.childRegisterData.instrument ?? null,
                time_amount:
                    parseInt(state.childRegisterData.time_amount) || null,
                school: state.childRegisterData.school ?? null,
                mascot: state.childRegisterData.mascot ?? null,
                days: state.childRegisterData.days ?? [],
                lesson_day: state.childRegisterData.lesson_day || null,
            };

            const result = await ApiClient.post(
                "/auth/register-child",
                payload,
            );

            if (!result || result.error || !result.success) {
                throw new Error(result?.error || "Child creation error");
            }

            this.app.model.session.setActiveChild(result.childId);
            await this.app.child.loadChildData();

            const savedName = state.childRegisterData.name;
            const savedMascot = state.childRegisterData.mascot;

            this.app.model.resetAuthData();
            this.app.model.authState.childRegisterData.name = savedName;
            this.app.model.authState.childRegisterData.mascot = savedMascot;

            this.app.model.setAuthStep(8);
            this.app.model.setLoading(false);
            this.triggerRender();
        } catch (err) {
            this.app.model.setLoading(false);
            this.triggerRender();
        }
    }

    logout() {
        this.app.model.session.clear();
        localStorage.removeItem("activeChildId");
        this.app.model.resetAuthData();
        this.app.navigation.goTo("login");
    }

    async triggerRender() {
        if (this.app.view.currentPage) {
            const content = await this.app.view.currentPage.render();
            this.app.view.appRoot.replaceChildren(content);
        }
    }
}
