export class NavigationController {
    constructor(app) {
        this.app = app;
    }

    goTo(pageName, params = {}) {
        console.log("Navigation →", pageName, params);

        this.app.view.renderPage(pageName, params);
    }

    back() {
        window.history.back();
    }
}
