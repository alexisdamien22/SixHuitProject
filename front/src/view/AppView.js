import { HomePage } from "./pages/HomePage.js";
import { CreateAccountPage } from "./pages/CreateAccountPage.js";
import { LoginPage } from "./pages/LoginPage.js";

export class AppView {
    constructor() {
        this.appRoot = document.getElementById("app");
        this.headerRoot = document.getElementById("header-placeholder");
        this.footerRoot = document.getElementById("footer-placeholder");

        this.currentPage = null;
    }

    init(app) {
        this.app = app;
        this.renderHeader();
        this.renderFooter();
    }

    renderPage(pageName, params = {}) {
        console.log("AppView → renderPage :", pageName);

        let page = null;

        switch (pageName) {
            case "home":
                page = new HomePage(this.app, params);
                break;

            case "create-account":
                page = new CreateAccountPage(this.app, params);
                break;

            case "login":
                page = new LoginPage(this.app, params);
                break;

            default:
                page = this.createErrorPage(pageName);
                break;
        }

        this.currentPage = page;

        this.appRoot.replaceChildren();

        this.appRoot.appendChild(page.render());
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

    updateChildData(data) {
        console.log("AppView → updateChildData :", data);

        this.updateHeader(data);

        if (this.currentPage && typeof this.currentPage.update === "function") {
            this.currentPage.update(data);
        }
    }

    renderHeader() {
        this.headerRoot.replaceChildren();

        const header = document.createElement("header");
        header.classList.add("app-header");

        const title = document.createElement("h1");
        title.textContent = "Six-Huit";

        const childInfo = document.createElement("div");
        childInfo.id = "child-info";

        header.appendChild(title);
        header.appendChild(childInfo);

        this.headerRoot.appendChild(header);
    }

    updateHeader(data) {
        const el = document.getElementById("child-info");
        if (!el) return;

        el.replaceChildren();

        const name = document.createElement("strong");
        name.textContent = data.child?.name || "Enfant";

        const streak = document.createElement("span");
        streak.textContent = `🔥 ${data.streak?.value || 0}`;

        el.appendChild(name);
        el.appendChild(streak);
    }

    renderFooter() {
        this.footerRoot.replaceChildren();

        const footer = document.createElement("footer");
        footer.classList.add("app-footer");

        const btnHome = document.createElement("button");
        btnHome.textContent = "Accueil";
        btnHome.onclick = () => this.app.navigation.goTo("home");

        const btnLogin = document.createElement("button");
        btnLogin.textContent = "Connexion";
        btnLogin.onclick = () => this.app.navigation.goTo("login");

        footer.appendChild(btnHome);
        footer.appendChild(btnLogin);

        this.footerRoot.appendChild(footer);
    }
}
