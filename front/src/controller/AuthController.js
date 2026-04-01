import { ApiClient } from "../model/ApiClient.js";

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
        this.app.model.updateAuthData("register-child", "instrument", instrumentId);

        if (
            this.app.view.currentPage &&
            typeof this.app.view.currentPage.refreshInstrumentSelection === "function"
        ) {
            this.app.view.currentPage.refreshInstrumentSelection();
        }
    }

    handleMascotSelect(mascot) {
        this.app.model.updateAuthData("register-child", "mascot", mascot);

        if (
            this.app.view.currentPage &&
            typeof this.app.view.currentPage.refreshMascotSelection === "function"
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

            if (result.error) throw new Error(result.error);

            this.app.model.session.saveSession({
                token: result.token,
                adultId: result.adultId,
            });

            this.app.model.setLoading(false);
            this.app.navigation.goTo("home");
        } catch (err) {
            this.app.model.setLoading(false);
            alert(err.message || "Identifiants incorrects.");
            this.triggerRender();
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
            });

            if (result.error) throw new Error(result.error);

            this.app.model.session.saveSession({
                token: result.token,
                adultId: result.userId || result.adultId,
            });

            this.app.model.setLoading(false);
            this.app.navigation.goTo("register-child");
        } catch (err) {
            this.app.model.setLoading(false);
            alert(err.message || "Erreur lors de la création du compte.");
            this.triggerRender();
        }
    }

    async handleNextChildStep() {
        const state = this.app.model.getAuthState();

        if (state.step < 7) {
            this.app.model.setAuthStep(state.step + 1);
            this.triggerRender();
        } else {
            await this.submitChildRegistration();
        }
    }

    async submitChildRegistration() {
        const state = this.app.model.getAuthState();
        if (state.isLoading) return;

        this.app.model.setLoading(true);
        this.triggerRender();

        try {
            const payload = {
                name: state.childRegisterData.name,
                age: parseInt(state.childRegisterData.age) || null,
                instrument: state.childRegisterData.instrument,
                time_amount: parseInt(state.childRegisterData.time_amount) || null,
                school: state.childRegisterData.school,
                mascot: state.childRegisterData.mascot,
                days: state.childRegisterData.days,
            };

            const token = this.app.model.session.getToken();

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/auth/register-child`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );

            const result = await response.json();
            if (!response.ok || !result.success)
                throw new Error(result.error || "Erreur création enfant");

            localStorage.setItem("activeChildId", result.childId);

            this.app.model.setAuthStep(8);
            this.app.model.setLoading(false);
            this.triggerRender();
        } catch (err) {
            this.app.model.setLoading(false);
            alert(err.message || "Erreur réseau");
            this.triggerRender();
        }
    }

    logout() {
        this.app.model.session.clear();
        localStorage.removeItem("activeChildId");
        this.app.model.setAuthStep(1);
        this.app.navigation.goTo("login");
    }

    triggerRender() {
        if (this.app.view.currentPage) {
            this.app.view.appRoot.replaceChildren(this.app.view.currentPage.render());
        }
    }
}
