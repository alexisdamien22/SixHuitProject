import { el } from "../../utils/DOMBuilder.js";

export class ParentHomePage {
    constructor(app) {
        this.app = app;
    }

    async render() {
        await this.app.model.fetchChildrenAccounts();
        const children = this.app.model.childrenAccounts || [];

        const childCards = children.map((child) =>
            el(
                "div",
                {
                    className: "parent-child-item",
                    onClick: () => {
                        this.app.model.session.setViewingChildId(child.id);
                        this.app.navigation.goTo("parentChildDetails");
                    },
                },
                el(
                    "div",
                    {},
                    el(
                        "span",
                        { style: "display: block; font-weight: bold;" },
                        child.name,
                    ),
                    el(
                        "span",
                        {
                            style: "font-size: 12px; color: var(--color-text-sub);",
                        },
                        child.instrument,
                    ),
                ),
                el(
                    "button",
                    {
                        className: "card-settings-btn",
                        onClick: (e) => {
                            e.stopPropagation();
                            this.app.model.session.setViewingChildId(child.id);
                            this.app.navigation.goTo("parentChildSettings");
                        },
                    },
                    "⚙️",
                ),
            ),
        );

        return el(
            "div",
            { className: "page parent-dashboard" },
            el("h1", { className: "ca-title" }, "Parent Space"),
            el(
                "div",
                { className: "parent-section-card" },
                el("h3", { style: "margin-bottom: 15px;" }, "My Children"),
                ...childCards,
            ),
            el(
                "button",
                {
                    className: "ca-btn-next",
                    onClick: () => this.app.navigation.goTo("registerChild"),
                },
                "+ Add Profile",
            ),
            el(
                "button",
                {
                    className: "parent-logout-btn",
                    style: "margin-top: 20px;",
                    onClick: () => this.app.auth.logout(),
                },
                "Logout",
            ),
        );
    }
}
