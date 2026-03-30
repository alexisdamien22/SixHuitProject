export class Footer {
    constructor(app) {
        this.app = app;
    }

    render() {
        const footer = document.createElement("footer");
        footer.classList.add("main-footer");

        const homeBtn = document.createElement("img");
        homeBtn.src = "/assets/img/icons/home.png";
        homeBtn.classList.add("icon-footer");
        homeBtn.onclick = () => this.app.navigation.goTo("home");

        const musicBtn = document.createElement("img");
        musicBtn.src = "/assets/img/icons/music.png";
        musicBtn.classList.add("icon-footer");
        musicBtn.onclick = () => this.app.navigation.goTo("music");

        const podiumBtn = document.createElement("img");
        podiumBtn.src = "/assets/img/icons/podium.png";
        podiumBtn.classList.add("icon-footer");
        podiumBtn.onclick = () => this.app.navigation.goTo("podium");

        footer.appendChild(homeBtn);
        footer.appendChild(musicBtn);
        footer.appendChild(podiumBtn);

        return footer;
    }
}
