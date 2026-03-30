export class ParentHomePage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const root = document.createElement("div");
        root.classList.add("page", "parent-home-page");

        const title = document.createElement("h2");
        title.textContent = "Espace Parent";

        const child = this.app.model.getChildData();

        const info = document.createElement("div");
        info.classList.add("parent-info");

        const name = document.createElement("p");
        name.textContent = `Enfant : ${child.name}`;

        const streak = document.createElement("p");
        streak.textContent = `Streak actuel : ${child.streak}`;

        info.appendChild(name);
        info.appendChild(streak);

        root.appendChild(title);
        root.appendChild(info);

        return root;
    }
}