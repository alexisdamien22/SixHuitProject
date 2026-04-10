export class NavigationController {
    constructor(app) {
        this.app = app;
    }

    async goTo(pageName, params = {}) {
        if (this.app.metronome) {
            this.app.metronome.stop();
        }

        const activeChildId = this.app.model.session.getChildId();

        if (pageName === "parent-home" && activeChildId) {
            if (
                this.app.child &&
                typeof this.app.child.loadChildData === "function"
            ) {
                await this.app.child.loadChildData();
            }
            this.app.view.renderPage("home", params);
            return;
        }

        this.app.view.renderPage(pageName, params);
    }

    back() {
        window.history.back();
    }
}
