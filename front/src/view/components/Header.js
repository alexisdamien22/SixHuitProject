export class Header {
    constructor(app) {
        this.app = app;
    }

    render() {
        const header = document.createElement("header");
        header.classList.add("main-header");

        const title = document.createElement("h1");
        title.textContent = "Six-Huit";

        const childInfo = document.createElement("div");
        childInfo.id = "child-info";

        header.appendChild(title);
        header.appendChild(childInfo);

        return header;
    }

    update(data) {
        const el = document.getElementById("child-info");
        if (!el) return;

        el.replaceChildren();

        const name = document.createElement("strong");
        name.textContent = data.name;

        const streak = document.createElement("span");
        streak.textContent = `🔥 ${data.streak}`;

        el.appendChild(name);
        el.appendChild(streak);
    }
}
