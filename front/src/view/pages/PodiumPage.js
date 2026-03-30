export class PodiumPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const root = document.createElement("div");
        root.classList.add("page", "podium-page");

        const title = document.createElement("h2");
        title.textContent = "Podium";

        const desc = document.createElement("p");
        desc.textContent = "Classement des élèves (à venir).";

        root.appendChild(title);
        root.appendChild(desc);

        return root;
    }
}