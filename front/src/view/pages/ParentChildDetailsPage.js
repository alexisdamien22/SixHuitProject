import { el } from "../../utils/DOMBuilder.js";
import { ApiClient } from "../../model/ApiClient.js";

export class ParentChildDetailsPage {
    constructor(app) {
        this.app = app;
        this.childData = null;
        this.isLoading = true;
    }

    async render() {
        const childId = localStorage.getItem("viewingChildId");

        // Si les données ne sont pas chargées, ou si on regarde un autre enfant
        if (!this.childData || this.childData.id != childId) {
            this.isLoading = true;
            this.childData = null; // Réinitialiser les données si l'ID de l'enfant change
            try {
                const data = await ApiClient.get(`/child/${childId}`);
                if (data && !data.error) {
                    this.childData = data;
                } else {
                    throw new Error(
                        data?.error ||
                            "Impossible de récupérer les données de l'enfant.",
                    );
                }
            } catch (err) {
                console.error(
                    "Erreur lors de la récupération des détails de l'enfant:",
                    err,
                );
                this.childData = { id: childId, name: "Profil introuvable" };
            } finally {
                this.isLoading = false;
            }
        }

        if (this.isLoading || !this.childData) {
            return el(
                "div",
                { className: "page page-centered" },
                "Chargement...",
            );
        }
        const child = this.childData;

        const mascot = child.mascot || "🎵";
        const name = child.name || "Profil introuvable";
        const rawInstrument = child.instrument || "";
        const instrument = rawInstrument
            ? rawInstrument.charAt(0).toUpperCase() + rawInstrument.slice(1)
            : "-";
        const streak = child.streak || 0;

        const historyList = child.history || child.sessions || [];
        const emojis = ["😞", "🫥", "😊", "🤩"];

        // --- KPI Statistiques ---
        const totalSessions = historyList.length;
        const successfulSessions = historyList.filter(
            (s) => s.quality === 1 || s.quality === 2,
        ).length;
        const successRate =
            totalSessions > 0
                ? Math.round((successfulSessions / totalSessions) * 100)
                : 0;

        // --- Graphique des 7 dernières séances ---
        // On prend les 7 dernières (historyList est trié du plus récent au plus ancien), et on inverse pour l'ordre chronologique
        const recentSessions = historyList.slice(0, 7).reverse();

        const graphBars =
            recentSessions.length > 0
                ? recentSessions.map((session) => {
                      const heightPercent = ((session.happiness + 1) / 4) * 100;

                      let bgColor = "#58cc02"; // Vert: temps respecté
                      if (session.quality === 0) bgColor = "#ff5252"; // Rouge: non respecté
                      if (session.quality === 2) bgColor = "#ffc800"; // Jaune: dépassé

                      const dateObj = new Date(session.session_date);
                      const dateStr = !isNaN(dateObj)
                          ? dateObj.toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                            })
                          : "?";

                      return el(
                          "div",
                          {
                              style: "display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1;",
                          },
                          // Barre de progression
                          el(
                              "div",
                              {
                                  style: "height: 120px; width: 100%; max-width: 24px; background: var(--color-bg-soft, #f0f0f0); border-radius: 6px; display: flex; align-items: flex-end; overflow: hidden;",
                              },
                              el("div", {
                                  style: `height: ${heightPercent}%; width: 100%; background-color: ${bgColor}; border-radius: 6px; transition: height 0.5s ease-out;`,
                              }),
                          ),
                          // Date
                          el(
                              "span",
                              {
                                  style: "font-size: 11px; color: #888; text-align: center; line-height: 1.2; white-space: nowrap;",
                              },
                              dateStr,
                          ),
                          // Émoji d'humeur
                          el(
                              "span",
                              { style: "font-size: 14px;" },
                              emojis[session.happiness] || "❓",
                          ),
                      );
                  })
                : [
                      el(
                          "p",
                          {
                              className: "empty-history-text",
                              style: "width: 100%; text-align: center; color: #888;",
                          },
                          "Pas encore assez de données pour le graphique.",
                      ),
                  ];

        const graphWidget = el(
            "div",
            {
                style: "display: flex; justify-content: space-between; align-items: flex-end; padding: 20px; background: white; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-top: 15px; width: 100%; gap: 5px; box-sizing: border-box;",
            },
            ...graphBars,
        );

        // Légende du graphique
        const graphLegend = el(
            "div",
            {
                style: "display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-top: 15px; font-size: 12px; color: #666;",
            },
            el(
                "div",
                { style: "display: flex; align-items: center; gap: 5px;" },
                el("div", {
                    style: "width: 10px; height: 10px; border-radius: 3px; background-color: #58cc02;",
                }),
                "Temps respecté",
            ),
            el(
                "div",
                { style: "display: flex; align-items: center; gap: 5px;" },
                el("div", {
                    style: "width: 10px; height: 10px; border-radius: 3px; background-color: #ffc800;",
                }),
                "Temps dépassé",
            ),
            el(
                "div",
                { style: "display: flex; align-items: center; gap: 5px;" },
                el("div", {
                    style: "width: 10px; height: 10px; border-radius: 3px; background-color: #ff5252;",
                }),
                "Non respecté",
            ),
        );

        // Liste des amis (à connecter avec tes vraies données d'amis du backend)
        const friendsList = child.friends || [];
        const friendsItems =
            friendsList.length > 0
                ? friendsList.map((friend) =>
                      el(
                          "div",
                          {
                              className: "user-card",
                              style: "margin-bottom: 10px;",
                          },
                          el(
                              "div",
                              { className: "user-avatar" },
                              friend.mascot || "🎵",
                          ),
                          el(
                              "div",
                              { className: "user-info" },
                              el(
                                  "div",
                                  { className: "user-name" },
                                  friend.name,
                              ),
                          ),
                      ),
                  )
                : el(
                      "p",
                      { className: "empty-history-text" },
                      "Aucun ami ajouté pour le moment.",
                  );

        return el(
            "div",
            { className: "page profile-page", style: "padding-bottom: 40px;" },

            el(
                "button",
                {
                    className: "start-btn",
                    style: "margin-bottom: 20px; align-self: flex-start;",
                    onClick: () => this.app.navigation.goTo("parentHome"),
                },
                "← Retour",
            ),

            el(
                "div",
                { className: "profil-img" },
                // On affiche la mascotte directement ou son image
                el(
                    "div",
                    {
                        className: "profil-img-content",
                        style: "font-size: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-bg-soft); box-shadow: 0 4px 10px rgba(0,0,0,0.1);",
                    },
                    mascot,
                ),
            ),
            el(
                "h2",
                { className: "profil-name", style: "margin-bottom: 5px;" },
                name,
            ),
            el(
                "p",
                {
                    style: "text-align: center; color: #888; margin-bottom: 25px; font-weight: 500;",
                },
                instrument,
            ),

            // --- GRILLE DE STATS ---
            el(
                "div",
                {
                    className: "stats-row",
                    style: "display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; margin-bottom: 25px;",
                },
                el(
                    "div",
                    {
                        className: "card",
                        style: "padding: 15px; margin: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 16px; background: white;",
                    },
                    el(
                        "h3",
                        {
                            style: "font-size: 13px; color: #888; margin-bottom: 10px; text-align: center;",
                        },
                        "Série de feu",
                    ),
                    el(
                        "div",
                        {
                            style: "font-size: 28px; font-weight: bold; text-align: center;",
                        },
                        `🔥 ${streak}`,
                    ),
                ),
                el(
                    "div",
                    {
                        className: "card",
                        style: "padding: 15px; margin: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 16px; background: white;",
                    },
                    el(
                        "h3",
                        {
                            style: "font-size: 13px; color: #888; margin-bottom: 10px; text-align: center;",
                        },
                        "Réussite",
                    ),
                    el(
                        "div",
                        {
                            style: "font-size: 28px; font-weight: bold; color: #58cc02; text-align: center;",
                        },
                        `${successRate}%`,
                    ),
                ),
                el(
                    "div",
                    {
                        className: "card",
                        style: "padding: 20px 15px; margin: 0; grid-column: span 2; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 16px; background: white; display: flex; justify-content: space-between; align-items: center;",
                    },
                    el(
                        "h3",
                        { style: "font-size: 15px; color: #555; margin: 0;" },
                        "Total des séances jouées",
                    ),
                    el(
                        "div",
                        {
                            style: "font-size: 24px; font-weight: bold; color: var(--color-primary, #6806ed);",
                        },
                        totalSessions,
                    ),
                ),
            ),

            // --- GRAPHIQUE ---
            el(
                "div",
                { className: "history-section", style: "width: 100%;" },
                el(
                    "h3",
                    { style: "margin-bottom: 5px; font-size: 18px;" },
                    "Performance récente",
                ),
                el(
                    "p",
                    {
                        style: "font-size: 13px; color: #888; line-height: 1.4;",
                    },
                    "Évolution de l'humeur (hauteur) et du respect du temps (couleur) sur les 7 dernières séances.",
                ),
                graphWidget,
                graphLegend,
            ),

            // --- AMIS ---
            el(
                "div",
                {
                    className: "history-section",
                    style: "margin-top: 30px; width: 100%;",
                },
                el("h3", {}, "Amis de l'enfant"),
                ...(Array.isArray(friendsItems)
                    ? friendsItems
                    : [friendsItems]),
            ),
        );
    }
}
