import { NavigationController } from "./NavigationController.js";
import { AuthController } from "./AuthController.js";
import { ChildController } from "./ChildController.js";
import { SocialController } from "./SocialController.js";
import { ApiClient } from "../model/ApiClient.js";
import { FlashMessageManager } from "../utils/FlashMessageManager.js";

export class AppController {
    constructor(appModel, appView) {
        this.model = appModel;
        this.view = appView;

        this.navigation = new NavigationController(this);
        this.auth = new AuthController(this);
        this.child = new ChildController(this);
        this.social = new SocialController(this);
    }

    async init() {
        console.log("AppController INIT");

        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get("resetToken");

        await this.model.loadSession();
        this.view.init(this);

        if (resetToken) {
            this.model.setResetToken(resetToken);
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
            );
            this.navigation.goTo("resetPassword");
            return;
        }

        if (!this.model.session.isLoggedIn()) {
            this.navigation.goTo("login");
            return;
        }

        const childId =
            this.model.session.getChildId() ||
            localStorage.getItem("activeChildId");

        if (this.model.session.isParent() && !childId) {
            this.navigation.goTo("parent-home");
            return;
        }

        if (childId) {
            await this.child.loadChildData();
            // On vérifie les interactions après avoir chargé les données de l'enfant
            await this.checkInteractions(childId);
        }

        this.navigation.goTo("home");
    }

    async checkInteractions(childId) {
        try {
            const notifications = await ApiClient.get(
                `/social/${childId}/notifications`,
            );

            if (Array.isArray(notifications) && notifications.length > 0) {
                // Délai de 500ms pour s'assurer que le flash-container est prêt dans le DOM
                setTimeout(() => {
                    notifications.forEach((notif) => {
                        const isRemind = notif.type === "remind";
                        const message = isRemind
                            ? `🔔 ${notif.senderName} te rappelle de faire ta série !`
                            : `🎉 ${notif.senderName} t'a félicité pour ton travail !`;

                        FlashMessageManager.show(message, "info", isRemind);
                    });
                }, 500);
            }
        } catch (err) {
            console.error("Error checking social interactions:", err);
        }
    }
}
