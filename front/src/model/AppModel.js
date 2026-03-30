import { SessionStore } from "./SessionStore.js";

export class AppModel {
    constructor() {
        this.session = new SessionStore();

        this.childData = null;
    }

    async loadSession() {
        console.log("Chargement de la session…");

        this.session.load();

        if (!this.session.isLoggedIn()) {
            console.log("Aucune session active");
            return;
        }

        console.log("Session trouvée :", this.session.data);
    }

    setChildData(data) {
        console.log("Stockage des données enfant :", data);
        this.childData = data;
    }

    getChildData() {
        return this.childData;
    }
}
