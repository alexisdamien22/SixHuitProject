export class SettingsPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const root = document.createElement("div");
        root.classList.add("page", "settings-page");

        const title = document.createElement("h2");
        title.textContent = "Paramètres";

        const logoutBtn = document.createElement("button");
        logoutBtn.textContent = "Se déconnecter";
        logoutBtn.classList.add("start-btn");

        logoutBtn.onclick = () => {
            this.app.auth.logout();
        };

        root.appendChild(title);
        root.appendChild(logoutBtn);

        return root;
    }
}