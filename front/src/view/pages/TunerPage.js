import { el } from "../../utils/DOMBuilder.js";

export class TunerPage {
    constructor(app) {
        this.app = app;
    }

    async render() {
        return el(
            "div",
            { className: "page page-centered" },
            el("h2", { className: "ca-title" }, "Accordeur"),
            el(
                "div",
                { className: "tuner-container" },
                el("p", {}, "Microphone en attente..."),
                el("div", { className: "tuner-needle" }),
            ),
            el(
                "button",
                {
                    className: "ca-main-btn mt-24",
                    onClick: () => this.app.navigation.goTo("home"),
                },
                "Retour",
            ),
        );
    }
}
