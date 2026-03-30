import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";

import { HomePage } from "./pages/HomePage.js";
import { CreateAccountPage } from "./pages/CreateAccountPage.js";
import { ProfilPage } from "./pages/ProfilPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";

export class AppView {
    constructor() {
        this.appRoot = document.getElementById("app");
        this.headerRoot = document.getElementById("header-placeholder");
        this.footerRoot = document.getElementById("footer-placeholder");
    }

    init(app) {
        this.app = app;

        this.header = new Header(app);
        this.footer = new Footer(app);

        this.headerRoot.appendChild(this.header.render());
        this.footerRoot.appendChild(this.footer.render());
    }

    renderPage(name, params = {}) {
        this.appRoot.replaceChildren();

        let page;

        switch (name) {
            case "home":
                page = new HomePage(this.app, params);
                break;

            case "create-account":
                page = new CreateAccountPage(this.app, params);
                break;

            case "profil":
                page = new ProfilPage(this.app, params);
                break;

            case "settings":
                page = new SettingsPage(this.app, params);
                break;

            default:
                page = this.createErrorPage(name);
        }

        this.currentPage = page;
        this.appRoot.appendChild(page.render());
    }

    updateChildData(data) {
        this.header.update(data);

        if (this.currentPage?.update) {
            this.currentPage.update(data);
        }
    }

    createErrorPage(name) {
        return {
            render() {
                const div = document.createElement("div");
                div.textContent = `Page inconnue : ${name}`;
                return div;
            }
        };
    }
}