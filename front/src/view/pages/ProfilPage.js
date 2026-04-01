import { el } from "../../utils/DOMBuilder.js";

export class ProfilPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const child = this.app.model.getChildData() || {};
        const mascot = child.mascot || "👤";
        const name = child.name || "Profil";
        const rawInstrument = child.instrument || "";
        const instrument = rawInstrument
            ? rawInstrument.charAt(0).toUpperCase() + rawInstrument.slice(1)
            : "-";
        const streak = child.streak || 0;

        return el(
            "div",
            { className: "page profile-page" },
            el("div", { className: "profil-img profil-img-container" }, mascot),
            el("p", { className: "profil-name" }, name),

            el(
                "div",
                { className: "stats-row" },
                el(
                    "div",
                    { className: "card" },
                    el("h3", {}, "Série actuelle"),
                    el(
                        "div",
                        { className: "strik strik-centered" },
                        el("span", { className: "strik-text" }, `🔥 ${streak}`),
                    ),
                ),
                el(
                    "div",
                    { className: "card" },
                    el("h3", {}, "Instrument"),
                    el("p", { className: "instrument-text" }, instrument),
                ),
            ),

            el(
                "div",
                { className: "history-section" },
                el("h3", {}, "Historique des séances"),
            ),
        );
    }
}
