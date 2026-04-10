import { NavigationController } from "./NavigationController.js";
import { AuthController } from "./AuthController.js";
import { ChildController } from "./ChildController.js";
import { SocialController } from "./SocialController.js";
import { ApiClient } from "../model/ApiClient.js";
import { FlashMessageManager } from "../utils/FlashMessageManager.js";
import { MetronomeController } from "./MetronomeController.js";
import { NotificationController } from "./NotificationController.js";

export class AppController {
    constructor(appModel, appView) {
        this.model = appModel;
        this.view = appView;
        this.isCheckingInteractions = false;

        this.navigation = new NavigationController(this);
        this.auth = new AuthController(this);
        this.child = new ChildController(this);
        this.social = new SocialController(this);
        this.metronome = new MetronomeController(this);
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

        const childId = this.model.session.getChildId();

        if (this.model.session.isParent() && !childId) {
            this.navigation.goTo("parent-home");
            return;
        }

        if (childId) {
            await this.child.loadChildData();

            if (!this.isCheckingInteractions) {
                await this.checkInteractions(childId);
            }

            setTimeout(() => {
                NotificationController.subscribeUser(childId);
            }, 2000);
        }

        this.navigation.goTo("home");
    }

    async checkInteractions(childId) {
        if (this.isCheckingInteractions) return;
        this.isCheckingInteractions = true;

        try {
            const notifications = await ApiClient.get(
                `/social/${childId}/notifications`,
            );

            if (Array.isArray(notifications) && notifications.length > 0) {
                notifications.forEach((notif, index) => {
                    setTimeout(() => {
                        const isRemind = notif.type === "remind";
                        const message = isRemind
                            ? `🔔 ${notif.senderName} te rappelle de faire ta série !`
                            : `🎉 ${notif.senderName} t'a félicité pour ton travail !`;

                        FlashMessageManager.show(message, "info", false);
                    }, index * 500);
                });
            }
        } catch (err) {
            console.error("Error checking social interactions:", err);
        } finally {
            setTimeout(() => {
                this.isCheckingInteractions = false;
            }, 5000);
        }
    }
}
