import { el } from "../../utils/DOMBuilder.js";

export class Footer {
    constructor(app) {
        this.app = app;
    }

    render() {
        return el(
            "footer",
            { className: "main-footer" },
            el("img", {
                src: "/assets/img/icons/home.png",
                className: "footer-home icon-footer active",
                dataset: { page: "home" },
                alt: "Accueil",
            }),
            el("img", {
                src: "/assets/img/icons/friends.png",
                className: "footer-community icon-footer",
                dataset: { page: "community" },
                alt: "Classement",
            }),
            el("img", {
                src: "/assets/img/icons/music.png",
                className: "footer-music icon-footer",
                dataset: { page: "music" },
                alt: "Musique",
            }),
            el("img", {
                src: "/assets/img/icons/menu.png",
                className: "footer-menu icon-footer",
                dataset: { page: "menu" },
                alt: "Menu",
            }),
        );
    }
}
