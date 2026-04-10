import { ApiClient } from "./ApiClient.js";

export class SessionStore {
    constructor() {
        this.data = {
            token: null,
            adultId: null,
            childId: null,
        };
        this.viewingChildId = null;
    }

    load() {
        const raw = localStorage.getItem("sixhuit-session");
        if (raw) {
            try {
                this.data = JSON.parse(raw);
                if (this.data.token) {
                    ApiClient.setToken(this.data.token);
                }
            } catch (err) {
                console.error("Erreur de parsing session :", err);
            }
        }

        const activeChild = localStorage.getItem("activeChildId");
        if (activeChild) {
            this.data.childId = activeChild;
        }
    }

    saveSession({ token, adultId, childId }) {
        this.data = { token, adultId, childId };
        localStorage.setItem("sixhuit-session", JSON.stringify(this.data));
        ApiClient.setToken(token);
    }

    clear() {
        this.data = { token: null, adultId: null, childId: null };
        this.viewingChildId = null;
        localStorage.removeItem("sixhuit-session");
        ApiClient.setToken(null);
    }

    clearActiveChild() {
        this.data.childId = null;
        localStorage.removeItem("activeChildId");
    }

    isLoggedIn() {
        return !!this.data.token;
    }

    getToken() {
        return this.data.token;
    }

    getAdultId() {
        return this.data.adultId;
    }

    getChildId() {
        return this.data.childId;
    }

    isParent() {
        return !!this.data.adultId;
    }

    isChild() {
        return !!this.data.childId;
    }

    setActiveChild(childId) {
        this.data.childId = childId;
        localStorage.setItem("activeChildId", childId);
    }

    setViewingChildId(id) {
        this.viewingChildId = id;
    }

    getViewingChildId() {
        return this.viewingChildId;
    }
}
