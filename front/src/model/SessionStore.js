export class SessionStore {
    constructor() {
        this.data = {
            token: null,
            adultId: null,
            childId: null,
        };
    }

    load() {
        const raw = localStorage.getItem("sixhuit-session");
        if (!raw) return;

        try {
            this.data = JSON.parse(raw);
        } catch (err) {
            console.error("Erreur de parsing session :", err);
        }
    }

    saveSession({ token, adultId, childId }) {
        this.data = { token, adultId, childId };
        localStorage.setItem("sixhuit-session", JSON.stringify(this.data));
    }

    clear() {
        this.data = { token: null, adultId: null, childId: null };
        localStorage.removeItem("sixhuit-session");
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
}
