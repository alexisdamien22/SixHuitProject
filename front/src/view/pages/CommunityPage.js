import { el } from "../../utils/DOMBuilder.js";
import { FlashMessageManager } from "../../utils/FlashMessageManager.js";

export class CommunityPage {
    constructor(app) {
        this.app = app;
        this.recommendations = [];
        this.friends = [];
        this.searchTimer = null;
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
            this.recommendations = [];
            this.friends = [];
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
                          "Tu n'as pas encore d'amis. Va dans l'onglet Ajouter !",
                      ),
                  ];

        const tabFeed = el(
            "div",
            {
                className: "tab-content active",
                id: "tab-feed",
            },
            el("h3", { className: "section-title" }, "Mes amis"),
            el("div", { className: "social-list" }, ...friendsContent),
        );

        const tabAdd = el(
            "div",
            {
                className: "tab-content",
                id: "tab-add",
            },
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

        const tabFeedBtn = el(
            "button",
            {
                className: "tab-btn active",
                onClick: (e) => this.switchTab("feed", e.target),
            },
            "Mes Amis",
        );
        const tabAddBtn = el(
            "button",
            {
                className: "tab-btn",
                onClick: (e) => this.switchTab("add", e.target),
            },
            "Ajouter",
        );
        const tabsContainer = el(
            "div",
            { className: "tabs-container" },
            tabFeedBtn,
            tabAddBtn,
        );

        this.container = el(
            "div",
            { className: "community-page" },
            el("h2", { className: "ca-title" }, "Communauté"),
            tabsContainer,
            tabFeed,
            tabAdd,
        );

        return this.container;
    }

    switchTab(tabId, btnTarget) {
        const tabFeed = this.container.querySelector("#tab-feed");
        const tabAdd = this.container.querySelector("#tab-add");

        if (tabId === "feed") {
            tabFeed.classList.add("active");
            tabAdd.classList.remove("active");
        } else {
            tabFeed.classList.remove("active");
            tabAdd.classList.add("active");
        }

        const btns = this.container.querySelectorAll(".tab-btn");
        btns.forEach((b) => b.classList.remove("active"));
        btnTarget.classList.add("active");
    }

    renderUserCard(user, isRec = false) {
        const isFriend = user.is_friend > 0;

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
                        try {
                            await this.app.social.follow(user.id);
                            e.target.textContent = "Suivi";
                            e.target.disabled = true;
                            FlashMessageManager.show(
                                `${user.name} ajouté(e) avec succès !`,
                                "success",
                            );
                        } catch (err) {
                            FlashMessageManager.show(
                                "Impossible d'ajouter cet ami.",
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
        const streak = friend.streak || 0;
        return el(
            "div",
            { className: "user-card" },
            el("div", { className: "user-avatar" }, friend.mascot || "🎵"),
            el(
                "div",
                { className: "user-info" },
                el("div", { className: "user-name" }, friend.name),
                el("div", { className: "user-detail" }, friend.instrument),
            ),
            el(
                "div",
                {
                    className: "user-streak",
                },
                `🔥 ${streak}`,
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
