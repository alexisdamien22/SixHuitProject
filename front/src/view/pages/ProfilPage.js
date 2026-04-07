import { el } from "../../utils/DOMBuilder.js";

export class ProfilPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const isParent =
            this.app.model.session?.isParent &&
            this.app.model.session.isParent() &&
            !localStorage.getItem("activeChildId");

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

        const historyList = child.history || child.sessions || [];
        const emojis = ["😞", "🫥", "😊", "🤩"];

        const historyItems =
            historyList.length > 0
                ? historyList.map((session) => {
                      const emoji = emojis[session.happiness] || "❓";
                      let qualityText = "Temps respecté";
                      if (session.quality === 0)
                          qualityText = "Temps non respecté";
                      if (session.quality === 2) qualityText = "Temps dépassé";

                      const dateStr = session.session_date
                          ? new Date(session.session_date).toLocaleDateString(
                                "fr-FR",
                            )
                          : "Date inconnue";
                      const dayName = session.practice_day || "Séance";

                      return el(
                          "div",
                          {
                              className: "history-card",
                          },

                          el(
                              "span",
                              { className: "history-card-date" },
                              dateStr,
                          ),

                          el(
                              "div",
                              { className: "history-card-botom" },
                              el(
                                  "div",
                                  { className: "history-card-emoji" },
                                  emoji,
                              ),
                              el(
                                  "span",
                                  { className: "history-card-quality" },
                                  qualityText,
                              ),
                          ),
                      );
                  })
                : [
                      el(
                          "p",
                          { className: "empty-history-text" },
                          "Aucune séance enregistrée pour le moment.",
                      ),
                  ];

        return el(
            "div",
            { className: "page profile-page" },
            el(
                "div",
                { className: "profil-img" },
                el("img", {
                    src: "/assets/img/mascots/camelion.png",
                    alt: "Profil Enfant",
                    className: "profil-img-content",
                }),
            ),
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
                        el("span", { className: "streak-text" }, `🔥 ${streak}`),
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
                ...historyItems,
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
            el(
                "div",
                { className: "profil-img" },
                el("img", {
                    src: "/assets/img/icons/family.png",
                    alt: "Profil Parent",
                    className: "profil-img-content",
                }),
            ),
            el("p", { className: "profil-name" }, name),

            el(
                "div",
                { className: "stats-row" },
                el(
                    "div",
                    { className: "card full-width" },
                    el("h3", {}, "Type de compte"),
                    el("p", { className: "instrument-text" }, "Administrateur"),
                    email ? el("p", { className: "parent-email" }, email) : "",
                ),
            ),

            el(
                "div",
                { className: "history-section" },
                el("h3", {}, "Abonnement & Facturation"),
                el(
                    "p",
                    { className: "subscription-desc" },
                    "Ici vous pourrez gérer votre abonnement et vos informations de paiement.",
                ),
            ),
        );
    }
}
