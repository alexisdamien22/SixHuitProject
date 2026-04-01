import { NavigationController } from "./NavigationController.js";
import { AuthController } from "./AuthController.js";
import { ChildController } from "./ChildController.js";

export class AppController {
    constructor(appModel, appView) {
        this.model = appModel;
        this.view = appView;

        this.navigation = new NavigationController(this);
        this.auth = new AuthController(this);
        this.child = new ChildController(this);
    }

    async init() {
        console.log("AppController INIT");

        await this.model.loadSession();
        this.view.init(this);

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
