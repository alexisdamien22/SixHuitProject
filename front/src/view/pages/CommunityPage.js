import { el } from "../../utils/DOMBuilder.js";
import { FlashMessageManager } from "../../utils/FlashMessageManager.js";

export class CommunityPage {
    constructor(app) {
        this.app = app;
        this.friends = [];
        this.recommendations = [];
    }

    async render() {
        try {
            this.recommendations =
                (await this.app.social.getRecommendations()) || [];
            this.friends = (await this.app.social.getFriends()) || [];
        } catch (err) {
            console.error(err);
        }

        const friendItems =
            this.friends.length > 0
                ? this.friends.map((f) => this.renderUserCard(f, false))
                : [el("p", { className: "empty-text" }, "No friends yet")];

        const recItems =
            this.recommendations.length > 0
                ? this.recommendations.map((r) => this.renderUserCard(r, true))
                : [el("p", { className: "empty-text" }, "No suggestions")];

        return el(
            "div",
            { className: "page community-page" },
            el("h2", { className: "ca-title" }, "Community"),
            el(
                "div",
                { className: "community-tabs" },
                el(
                    "button",
                    { className: "community-tab-btn active" },
                    "Friends",
                ),
                el("button", { className: "community-tab-btn" }, "Add"),
            ),
            el("div", { className: "community-list" }, ...friendItems),
            el(
                "h3",
                {
                    className: "ca-title",
                    style: "margin-top: 30px; font-size: 18px;",
                },
                "Suggestions",
            ),
            el("div", { className: "community-list" }, ...recItems),
        );
    }

    renderUserCard(user, isRec) {
        return el(
            "div",
            { className: "community-user-card" },
            el(
                "div",
                { className: "user-info" },
                el("span", { style: "font-weight: bold" }, user.name),
                el(
                    "div",
                    { style: "font-size: 12px; color: var(--color-text-sub)" },
                    user.instrument,
                ),
            ),
            isRec
                ? el(
                      "button",
                      {
                          className: "start-btn",
                          onClick: () => this.app.social.follow(user.id),
                      },
                      "+",
                  )
                : el("span", {}, `🔥 ${user.streak || 0}`),
        );
    }
}
