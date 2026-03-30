export class ProfilPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const root = document.createElement("div");
        root.classList.add("page", "profile-page");

        const title = document.createElement("h2");
        title.textContent = "Profil";

        const child = this.app.model.getChildData();

        const info = document.createElement("div");
        info.classList.add("profile-info");

        const name = document.createElement("p");
        name.textContent = `Nom : ${child.name}`;

        const instrument = document.createElement("p");
        instrument.textContent = `Instrument : ${child.instrument}`;

        const streak = document.createElement("p");
        streak.textContent = `Streak : ${child.streak}`;

        info.appendChild(name);
        info.appendChild(instrument);
        info.appendChild(streak);

        root.appendChild(title);
        root.appendChild(info);

        return root;
    }

    update(data) {
        // Si tu veux mettre à jour dynamiquement
    }
}