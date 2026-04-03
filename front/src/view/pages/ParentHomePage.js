import { el } from "../../utils/DOMBuilder.js";

export class ParentHomePage {
    constructor(app) {
        this.app = app;
    }

    async render() {
        if (
            this.app.model &&
            typeof this.app.model.fetchChildrenAccounts === "function"
        ) {
            await this.app.model.fetchChildrenAccounts();
        } else {
            console.warn(
                "[ParentHomePage] ATTENTION: fetchChildrenAccounts n'existe pas dans le modèle !",
            );
        }

        const parentData = this.app.model.getParentData() || {};
        const welcomeName = parentData.name ? `, ${parentData.name}` : "";

        const children = this.app.model?.childrenAccounts || [];

        return el(
            "div",
            {
                className: "parent-screen page",
            },
            el("h1", {}, "Espace Parent"),
            el(
                "p",
                { className: "parent-welcome-text" },
                `Bienvenue dans ton tableau de bord${welcomeName} !`,
            ),

            el(
                "div",
                {
                    className: "ca-form-block parent-info-block",
                },
                el("p", { className: "ca-question" }, "Gère les profils enfants ici."),
                children.length === 0
                    ? el(
                        "p",
                        { className: "parent-info-desc" },
                        "Crée un profil pour que ton enfant puisse commencer ses sessions de musique.",
                    )
                    : "",

                el(
                    "div",
                    { className: "parent-children-list" },
                    children.length > 0
                        ? children.map((child) =>
                            el(
                                "div",
                                { className: "parent-child-card" },
                                el(
                                    "div",
                                    { className: "parent-child-info" },
                                    el(
                                        "span",
                                        { className: "parent-child-avatar" },
                                        child.mascot || "🎵",
                                    ),
                                    el("span", { className: "parent-child-name" }, child.name),
                                ),
                                el(
                                    "button",
                                    { className: "parent-child-edit-btn" },
                                    "Modifier",
                                ),
                            ),
                        )
                        : el(
                            "p",
                            { className: "parent-no-child" },
                            "Aucun enfant associé pour le moment.",
                        ),
                ),

                el(
                    "button",
                    {
                        className: "ca-btn-next parent-add-btn",
                        onClick: () => this.app.navigation.goTo("registerChild"),
                    },
                    "+ Ajouter un profil enfant",
                ),
            ),

            el(
                "a",
                {
                    href: "#",
                    className: "parent-logout-btn",
                    onClick: (e) => {
                        e.preventDefault();
                        this.app.auth.logout();
                    },
                },
                "Se déconnecter",
            ),
        );
    }
}
