import { el } from "../../utils/DOMBuilder.js";

export class MusicPage {
    constructor(app) {
        this.app = app;
    }

    async render() {
        const childData = (await this.app.model.getChildData()) || {};
        const weeklyPlan = childData.weeklyPlan || [];

        const lessonsDoneCount = weeklyPlan.filter(
            (entry) => entry.status === 1,
        ).length;

        const anecdotes = this.app.model.getAnecdotes();

        const cards = anecdotes.map((item, index) => {
            const isUnlocked = index < lessonsDoneCount;

            const cardContent = [
                el("div", { className: "card-shadow" }),
                el(
                    "div",
                    {
                        className: "card-main",
                    },
                    el("img", {
                        src: item.img,
                        className: "card-img",
                        alt: item.title,
                    }),
                    !isUnlocked
                        ? el("div", { className: "card-lock-overlay" }, "🔒")
                        : null,
                    el("div", { className: "card-title" }, item.title),
                ),
            ];

            return el(
                "div",
                {
                    className: `anecdote-card ${!isUnlocked ? "is-locked" : ""}`,
                    onClick: () => (isUnlocked ? this.showModal(item) : null),
                },
                ...cardContent,
            );
        });

        return el(
            "div",
            { className: "page collection-page" },
            el("h2", { className: "page-title" }, "Ma Collection"),
            el(
                "p",
                { className: "page-subtitle" },
                `${lessonsDoneCount} anecdotes débloquées`,
            ),
            el("div", { className: "collection-grid" }, ...cards),
        );
    }

    showModal(item) {
        const modal = el(
            "div",
            {
                className: "modal-overlay",
                onClick: (e) => {
                    if (e.target.className === "modal-overlay") modal.remove();
                },
            },
            el(
                "div",
                { className: "modal-content" },
                el("img", { src: item.img, className: "modal-header-img" }),
                el(
                    "div",
                    { className: "modal-body" },
                    el("h3", {}, item.title),
                    el("p", { className: "modal-desc" }, item.desc),
                    el(
                        "button",
                        {
                            className: "start-btn",
                            onClick: () => modal.remove(),
                        },
                        "FERMER",
                    ),
                ),
            ),
        );

        document.body.appendChild(modal);
    }
}
