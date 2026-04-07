import { el } from "../../utils/DOMBuilder.js";

export class PodiumPage {
    constructor(app) {
        this.app = app;
        this.recommendations = [];
    }

    async render() {
        try {
            const response = await this.app.social.getRecommendations();
            this.recommendations = Array.isArray(response) ? response : [];
        } catch (err) {
            console.error("Error fetching social data:", err);
            this.recommendations = [];
        }

        const recommendationsContent =
            this.recommendations.length > 0
                ? this.recommendations.map((rec) =>
                      this.renderUserCard(rec, true),
                  )
                : el(
                      "p",
                      { className: "empty-text" },
                      "Pas encore de suggestions",
                  );

        this.container = el(
            "div",
            { className: "community-page" },
            el("h2", { className: "ca-title" }, "Communauté"),

            el(
                "div",
                { className: "search-bar-container" },
                el("input", {
                    type: "text",
                    placeholder: "Chercher un ami...",
                    className: "ca-input",
                    onInput: (e) => this.handleSearch(e.target.value),
                }),
            ),

            el("div", { id: "search-results", className: "social-list" }),

            el("h3", { className: "section-title" }, "Suggestions d'amis"),
            el("div", { className: "social-list" }, recommendationsContent),
        );

        return this.container;
    }

    renderUserCard(user, isRec = false) {
        return el(
            "div",
            { className: "user-card" },
            el("div", { className: "user-avatar" }, user.mascot || "🎵"),
            el(
                "div",
                { className: "user-info" },
                el("div", { className: "user-name" }, user.name),
                el(
                    "div",
                    { className: "user-detail" },
                    isRec
                        ? `${user.common_friends} amis en commun`
                        : user.instrument,
                ),
            ),
            el(
                "button",
                {
                    className: "start-btn add-friend-btn",
                    onClick: async (e) => {
                        await this.app.social.follow(user.id);
                        e.target.textContent = "Suivi";
                        e.target.disabled = true;
                    },
                },
                "+",
            ),
        );
    }

    async handleSearch(query) {
        const resultsContainer = document.getElementById("search-results");
        if (!resultsContainer) return;

        if (query.length < 2) {
            resultsContainer.replaceChildren();
            return;
        }

        const users = await this.app.social.search(query);
        if (Array.isArray(users)) {
            resultsContainer.replaceChildren(
                ...users.map((u) => this.renderUserCard(u)),
            );
        }
    }
}
