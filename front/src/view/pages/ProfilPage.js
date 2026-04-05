import { el } from "../../utils/DOMBuilder.js";

export class ProfilPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const isParent =
            this.app.model.session?.isParent &&
            this.app.model.session.isParent();

        if (isParent) {
            return this.renderParentProfile();
        }
        return this.renderChildProfile();
    }

    renderChildProfile() {
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
                        { className: "streak streak-centered" },
                        el(
                            "span",
                            { className: "streak-text" },
                            `🔥 ${streak}`,
                        ),
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

    renderParentProfile() {
        const parentData = this.app.model.getParentData() || {};
        const name = parentData.name
            ? `Parent : ${parentData.name}`
            : "Espace Parent";
        const email = parentData.email || "";

        return el(
            "div",
            { className: "page profile-page parent-profile" },
            el("div", { className: "profil-img profil-img-container" }, "🛡️"),
            el("p", { className: "profil-name" }, name),

            el(
                "div",
                { className: "stats-row" },
                el(
                    "div",
                    { className: "card full-width" },
                    el("h3", {}, "Type de compte"),
                    el("p", { className: "instrument-text" }, "Administrateur"),
                    email
                        ? el(
                              "p",
                              {
                                  style: "font-size: 0.9em; color: #888; margin-top: 5px;",
                              },
                              email,
                          )
                        : "",
                ),
            ),

            el(
                "div",
                { className: "history-section" },
                el("h3", {}, "Abonnement & Facturation"),
                el(
                    "p",
                    { style: "color: #888; margin-top: 10px;" },
                    "Ici vous pourrez gérer votre abonnement et vos informations de paiement.",
                ),
            ),
        );
    }
}
