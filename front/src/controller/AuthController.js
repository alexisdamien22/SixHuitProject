import { ApiClient } from "../model/ApiClient.js";

export class AuthController {
    constructor(app) {
        this.app = app;
    }

    async register(data) {
        try {
            console.log("Register →", data);

            const result = await ApiClient.post(`/auth/register`, data);

            console.log("Register result :", result);

            this.app.model.session.saveSession({
                token: result.token,
                adultId: result.adultId,
                childId: result.childId,
            });

            await this.app.child.loadChildData();

            this.app.navigation.goTo("home");

        } catch (err) {
            console.error("Erreur register :", err);
            throw err;
        }
    }

    async login(username, password) {
        try {
            console.log("Login →", username);

            const result = await ApiClient.post(`/auth/login`, {
                username,
                password,
            });

            console.log("Login result :", result);

            this.app.model.session.saveSession({
                token: result.token,
                adultId: result.adultId,
            });

            await this.loadChildAfterLogin();

            this.app.navigation.goTo("home");

        } catch (err) {
            console.error("Erreur login :", err);
            throw err;
        }
    }

    async loadChildAfterLogin() {
        try {
            const adultId = this.app.model.session.getAdultId();

            if (!adultId) return;

            console.warn("⚠️ loadChildAfterLogin : il manque une route backend pour récupérer les enfants d'un adulte.");

        } catch (err) {
            console.error("Erreur loadChildAfterLogin :", err);
        }
    }

    logout() {
        this.app.model.session.clear();
        this.app.navigation.goTo("create-account");
    }
}
