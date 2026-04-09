export class NavigationController {
    constructor(app) {
        this.app = app;
    }

    goTo(pageName, params = {}) {
        if (this.app.metronome) {
            this.app.metronome.stop();
        }

        this.app.view.renderPage(pageName, params);
    }

    back() {
        window.history.back();
    }
}
