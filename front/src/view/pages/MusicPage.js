export class MusicPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const root = document.createElement("div");
        root.classList.add("page", "music-page");

        const title = document.createElement("h2");
        title.textContent = "Leçon musicale";

        const desc = document.createElement("p");
        desc.textContent = "Ici tu pourras jouer, écouter et apprendre.";

        const backBtn = document.createElement("button");
        backBtn.textContent = "Retour";
        backBtn.classList.add("start-btn");

        backBtn.onclick = () => {
            this.app.navigation.goTo("home");
        };

        root.appendChild(title);
        root.appendChild(desc);
        root.appendChild(backBtn);

        return root;
    }
}