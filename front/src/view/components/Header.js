import { el } from "../../utils/DOMBuilder.js";
import { AppFireChange } from "../AppFireChange.js";

export class Header {
    constructor(app) {
        this.app = app;
    }

    update(data) {
        const streakText = document.querySelector(".strik-text");
        const streakIcon = document.querySelector(".strik-icon");

        let safeStreak = 0;
        if (data.streak !== undefined) {
            safeStreak =
                typeof data.streak === "object" && data.streak !== null
                    ? Number(data.streak.current_streak) || 0
                    : Number(data.streak) || 0;
        }

        if (streakText) {
            streakText.textContent = String(safeStreak);
        }

        if (streakIcon) {
            streakIcon.src = AppFireChange.FireTextur(safeStreak);
        }
    }

    render() {
        const childData = this.app.model.getChildData() || {};

        let streak = childData.streak || 0;
        if (typeof streak === "object" && streak !== null) {
            streak = Number(streak.current_streak) || 0;
        } else {
            streak = Number(streak) || 0;
        }

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
                        onClick: () =>
                            this.app.view.toggleAccountSwitcher(true),
                    },
                    el("img", {
                        src: "/assets/img/icons/family.png",
                        alt: "Profile",
                        className: "header-profile-img",
                    }),
                ),
                el(
                    "div",
                    { className: "strik" },
                    el("img", {
                        className: "strik-icon",
                        src: AppFireChange.FireTextur(streak),
                        alt: "Streak",
                    }),
                    el("p", { className: "strik-text" }, String(streak)),
                ),
            ),
            el("div", { className: "parametre", dataset: { rotation: "0" } }),
        );
    }
}
