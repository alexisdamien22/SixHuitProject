import { NavigationController } from "./NavigationController.js";
import { AuthController } from "./AuthController.js";
import { ChildController } from "./ChildController.js";
import { SocialController } from "./SocialController.js";

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

        if (this.model.session.isParent()) {
            this.navigation.goTo("parent-home");
            return;
        }

        await this.child.loadChildData();
        this.navigation.goTo("home");
    }
}
