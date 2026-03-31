import { ApiClient } from "../model/ApiClient.js";

export class AuthController {
    constructor(app) {
        this.app = app;
    }

    // --- GESTION DE L'INTERFACE (ONBOARDING) ---
    handleInput(mode, field, value) {
        this.app.model.updateAuthData(mode, field, value);
        this.triggerRender();
    }

    handleSwitchMode() {
        this.app.model.toggleLoginMode();
        this.triggerRender();
    }

    handleInstrumentSelect(instrumentId) {
        this.app.model.updateAuthData("register", "instrument", instrumentId);
        this.triggerRender();
    }

    handleMascotSelect(mascot) {
        this.app.model.updateAuthData("register", "mascotte", mascot);
        this.triggerRender();
    }

    handleDayToggle(day) {
        this.app.model.toggleRegisterDay(day);
        this.triggerRender();
    }

    async handleMainAction() {
        const state = this.app.model.getAuthState();
        if (state.isLoading) return;

        if (state.isLoginMode || state.step === 7) {
            this.app.model.setLoading(true);
            this.triggerRender();

            try {
                if (state.isLoginMode) {
                    await this.login(state.loginData.email, state.loginData.password);
                } else {
                    // Formatage strict pour l'API
                    const payload = {
                        email: state.registerData.email,
                        password: state.registerData.password,
                        teacher: false,
                        child: {
                            name: state.registerData.name,
                            age: parseInt(state.registerData.age) || null,
                            instrument: state.registerData.instrument,
                            duree: parseInt(state.registerData.duree) || null,
                            ecole: state.registerData.ecole,
                            mascotte: state.registerData.mascotte,
                            jours: state.registerData.jours,
                        },
                    };
                    await this.register(payload);
                }
            } catch (err) {
                this.app.model.setLoading(false);
                alert(err.message || "Erreur d'authentification.");
                this.triggerRender();
            }
        } else {
            this.app.model.setAuthStep(state.step + 1);
            this.triggerRender();
        }
    }

    // --- APPELS RÉSEAU ---
    async register(payload) {
        const result = await ApiClient.post(`/auth/register`, payload);
        if (result.error) throw new Error(result.error);

        this.app.model.session.saveSession({
            token: result.token,
            adultId: result.adultId,
            childId: result.childId,
        });

        this.app.model.setAuthStep(8);
        this.app.model.setLoading(false);
        this.triggerRender();
    }

    async login(email, password) {
        const result = await ApiClient.post(`/auth/login`, { email, password });
        if (result.error) throw new Error(result.error);

        this.app.model.session.saveSession({
            token: result.token,
            adultId: result.adultId,
        });

        this.app.model.setLoading(false);
        await this.app.child.loadChildData();
        this.app.navigation.goTo("home");
    }

    logout() {
        this.app.model.session.clear();
        this.app.navigation.goTo("create-account");
    }

    triggerRender() {
        this.app.navigation.goTo("create-account");
    }
}
