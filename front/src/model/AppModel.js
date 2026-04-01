import { SessionStore } from "./SessionStore.js";

export class AppModel {
    constructor() {
        this.session = new SessionStore();
        this.childData = null;

        this.authState = {
            step: 1,
            isLoginMode: true,
            isLoading: false,
            loginData: { email: "", password: "" },
            registerData: {
                email: "",
                password: "",
            },
            childRegisterData: {
                name: "",
                age: "",
                instrument: "",
                time_amount: "",
                school: "",
                mascot: "",
                days: [],
            },

        };
    }

    async loadSession() {
        console.log("Chargement de la session…");
        this.session.load();
    }

    getParentData() {
        return this.session.parentData || null;
    }

    setChildData(data) {
        this.childData = data;
    }

    getChildData() {
        return this.childData;
    }

    getAuthState() {
        return this.authState;
    }

    updateAuthData(mode, field, value) {
        if (mode === "login") {
            this.authState.loginData[field] = value;
        }
        else if (mode === "register-parent") {
            this.authState.registerData[field] = value;
        }
        else if (mode === "register-child") {
            this.authState.childRegisterData[field] = value;
        }
    }


    toggleLoginMode() {
        this.authState.isLoginMode = !this.authState.isLoginMode;
        this.authState.step = 1;
    }

    setAuthStep(step) {
        this.authState.step = step;
    }

    setLoading(isLoading) {
        this.authState.isLoading = isLoading;
    }

    toggleRegisterDay(day) {
        const days = this.authState.childRegisterData.days;
        const index = days.indexOf(day);
        if (index === -1) days.push(day);
        else days.splice(index, 1);
    }
}
