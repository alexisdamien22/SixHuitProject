import { el } from "../../utils/DOMBuilder.js";
import { AppFireChange } from "../AppFireChange.js";

export class Header {
    constructor(app) {
        this.app = app;
    }

    update(data) {
        const streakText = document.querySelector(".streak-text");
        const streakIcon = document.querySelector(".streak-icon");
        const streakContainer = document.querySelector(".streak");

        let safeStreak = 0;
        if (data.streak !== undefined) {
            safeStreak =
                typeof data.streak === "object" && data.streak !== null
                    ? Number(data.streak.current_streak) || 0
                    : Number(data.streak) || 0;
        }

        if (streakText) {
            streakText.textContent = String(safeStreak);

            const isFrozen =
                data.freeze_until && new Date(data.freeze_until) > new Date();
            let snowEmoji = streakContainer.querySelector(".freeze-indicator");

            if (isFrozen) {
                if (!snowEmoji) {
                    snowEmoji = document.createElement("span");
                    snowEmoji.className = "freeze-indicator";
                    snowEmoji.textContent = " ❄️";
                    streakText.after(snowEmoji);
                }
            } else if (snowEmoji) {
                snowEmoji.remove();
            }
        }

        if (streakIcon) {
            streakIcon.src = AppFireChange.FireTexture(safeStreak);
        }
    }

    render() {
        const childData = this.app.model.getChildData() || {};
        const isFrozen =
            childData.freeze_until &&
            new Date(childData.freeze_until) > new Date();

        let streak = childData.streak || 0;
        if (typeof streak === "object" && streak !== null) {
            streak = Number(streak.current_streak) || 0;
        } else {
            streak = Number(streak) || 0;
        }

        const isParentMode =
            this.app.model.session.isParent() &&
            !this.app.model.session.getChildId();
        const profileContent = isParentMode
            ? el("img", {
                  src: "/assets/img/icons/family.png",
                  alt: "Profile",
                  className: "header-profile-img",
              })
            : el(
                  "div",
                  { className: "header-mascot-icon" },
                  childData.mascot || "🎵",
              );

        return el(
            "header",
            { className: "main-header" },
            el(
                "div",
                { className: "header-left-group" },
                el(
                    "button",
                    {
                        className: "profile-icon header-profile-btn",
                    },
                    profileContent,
                ),
                el(
                    "div",
                    { className: "streak" },
                    el("img", {
                        className: "streak-icon",
                        src: AppFireChange.FireTexture(streak),
                        alt: "Streak",
                    }),
                    el("p", { className: "streak-text" }, String(streak)),
                    isFrozen
                        ? el("span", { className: "freeze-indicator" }, " ❄️")
                        : null,
                ),
            ),
            el("div", { className: "parametre", dataset: { rotation: "0" } }),
        );
    }
}
