import { el } from "../../utils/DOMBuilder.js";
import { FlashMessageManager } from "../../utils/FlashMessageManager.js";

export class CommunityPage {
    constructor(app) {
        this.app = app;
        this.recommendations = [];
        this.friends = [];
        this.searchTimer = null;
        this.container = null;
    }

    async render() {
        try {
            const [recResponse, friendsResponse] = await Promise.all([
                this.app.social.getRecommendations(),
                this.app.social.getFriends(),
            ]);
            this.recommendations = Array.isArray(recResponse)
                ? recResponse
                : [];
            this.friends = Array.isArray(friendsResponse)
                ? friendsResponse
                : [];
        } catch (err) {
            console.error("Error fetching social data:", err);
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

        const friendsContent =
            this.friends.length > 0
                ? this.friends.map((f) => this.renderFriendCard(f))
                : [
                      el(
                          "p",
                          { className: "empty-text" },
                          "Tu n'as pas encore d'amis.",
                      ),
                  ];

        const tabFeed = el(
            "div",
            { className: "tab-content active", id: "tab-feed" },
            el("h3", { className: "section-title" }, "Mes amis"),
            el("div", { className: "social-list" }, ...friendsContent),
        );

        const tabAdd = el(
            "div",
            { className: "tab-content", id: "tab-add" },
            el(
                "div",
                { className: "search-bar-container" },
                el("input", {
                    type: "text",
                    placeholder: "Chercher un ami...",
                    className: "ca-input",
                    onInput: (e) => {
                        clearTimeout(this.searchTimer);
                        this.searchTimer = setTimeout(
                            () => this.handleSearch(e.target.value),
                            300,
                        );
                    },
                }),
            ),
            el("div", { id: "search-results", className: "social-list" }),
            el("h3", { className: "section-title" }, "Suggestions d'amis"),
            el("div", { className: "social-list" }, recommendationsContent),
        );

        this.container = el(
            "div",
            { className: "community-page" },
            el("h2", { className: "ca-title" }, "Communauté"),
            el(
                "div",
                { className: "tabs-container" },
                el(
                    "button",
                    {
                        className: "tab-btn active",
                        onClick: (e) => this.switchTab("feed", e.target),
                    },
                    "Mes Amis",
                ),
                el(
                    "button",
                    {
                        className: "tab-btn",
                        onClick: (e) => this.switchTab("add", e.target),
                    },
                    "Ajouter",
                ),
            ),
            tabFeed,
            tabAdd,
        );

        return this.container;
    }

    switchTab(tabId, btnTarget) {
        this.container
            .querySelector("#tab-feed")
            .classList.toggle("active", tabId === "feed");
        this.container
            .querySelector("#tab-add")
            .classList.toggle("active", tabId === "add");
        this.container
            .querySelectorAll(".tab-btn")
            .forEach((b) => b.classList.remove("active"));
        btnTarget.classList.add("active");
    }

    renderUserCard(user, isRec = false) {
        return el(
            "div",
            { className: "user-card" },
            el(
                "div",
                { className: "user-avatar" },
                el("img", {
                    src: user.mascot,
                    alt: `Mascotte de ${user.name}`,
                    className: "user-avatar-img",
                }),
            ),
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
                        try {
                            await this.app.social.follow(user.id);
                            FlashMessageManager.show(
                                `${user.name} ajouté(e) !`,
                                "success",
                            );
                            this.app.navigation.goTo("community");
                        } catch (err) {
                            FlashMessageManager.show(
                                "Erreur lors de l'ajout.",
                                "error",
                            );
                        }
                    },
                },
                "+",
            ),
        );
    }

    renderFriendCard(friend) {
        const hasWorkedToday = friend.hasWorkedToday;
        return el(
            "div",
            { className: "user-card" },
            el(
                "div",
                { className: "user-avatar" },
                el("img", {
                    src: friend.mascot,
                    alt: `Mascotte de ${friend.name}`,
                    className: "user-avatar-img",
                }),
            ),
            el(
                "div",
                { className: "user-info" },
                el("div", { className: "user-name" }, friend.name),
                el("div", { className: "user-detail" }, friend.instrument),
            ),
            el(
                "div",
                { className: "user-actions" },
                el(
                    "div",
                    { className: "user-streak" },
                    `🔥 ${friend.streak || 0}`,
                ),
                el(
                    "button",
                    {
                        className: `interact-btn ${hasWorkedToday ? "btn-congrats" : "btn-remind"}`,
                        onClick: async (e) => {
                            const button = e.currentTarget;
                            if (button.disabled) return;

                            button.disabled = true;
                            button.style.opacity = "0.5";
                            button.style.cursor = "not-allowed";

                            try {
                                const res = await this.app.social.interact(
                                    friend.id,
                                );
                                FlashMessageManager.show(
                                    res.type === "congrats"
                                        ? "Félicitations envoyées ! 🎉"
                                        : "Rappel envoyé ! 🔔",
                                    "info",
                                );
                            } catch (err) {
                                button.disabled = false;
                                button.style.opacity = "1";
                                FlashMessageManager.show(
                                    "Erreur envoi",
                                    "error",
                                );
                            }
                        },
                    },
                    hasWorkedToday ? "🎉" : "🔔",
                ),
            ),
        );
    }

    async handleSearch(query) {
        const resultsContainer = document.getElementById("search-results");
        if (!resultsContainer || query.length < 2) {
            if (resultsContainer) resultsContainer.replaceChildren();
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
