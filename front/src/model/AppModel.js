import { SessionStore } from "./SessionStore.js";
import { ApiClient } from "./ApiClient.js";

export class AppModel {
    constructor() {
        this.session = new SessionStore();
        this.childData = null;
        this.childrenAccounts = [];
        this.resetAuthData();
    }

    resetAuthData() {
        this.authState = {
            step: 1,
            isLoginMode: true,
            isLoading: false,
            loginData: { email: "", password: "" },
            registerData: {
                email: "",
                password: "",
                pin: "",
            },
            childRegisterData: {
                name: "",
                age: "",
                instrument: "",
                time_amount: "",
                school: "",
                mascot: "",
                days: [],
                lesson_day: "",
            },
        };
    }

    async loadSession() {
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
        } else if (mode === "register-adult") {
            this.authState.registerData[field] = value;
        } else if (mode === "register-child") {
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

    async fetchChildrenAccounts() {
        try {
            if (!this.session.getToken()) return;

            const result = await ApiClient.get(`/auth/children`);

            if (result && result.success) {
                this.childrenAccounts = result.children;
            } else {
                this.childrenAccounts = [];
            }
        } catch (error) {
            console.error("[AppModel] Error fetch :", error);
            this.childrenAccounts = [];
        }
    }
}
