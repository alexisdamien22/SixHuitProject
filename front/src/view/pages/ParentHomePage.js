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
        }

        const children = this.app.model?.childrenAccounts || [];

        return el(
            "div",
            { className: "parent-screen page" },
            el("h1", { className: "ca-title" }, "Espace Parent"),
            el(
                "p",
                { className: "parent-welcome-text" },
                "Gère tes enfants et leurs progrès.",
            ),

            el(
                "div",
                { className: "parent-children-list" },
                children.length > 0
                    ? children.map((child) => this.renderChildCard(child))
                    : el(
                          "p",
                          { className: "parent-no-child" },
                          "Aucun enfant associé.",
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

    renderChildCard(child) {
        return el(
            "div",
            {
                className: "parent-child-card clickable-card",
                onClick: () => {
                    // Action par défaut : Voir les statistiques
                    localStorage.setItem("viewingChildId", child.id);
                    this.app.navigation.goTo("parentChildDetails");
                },
            },
            el(
                "div",
                { className: "parent-child-info" },
                el(
                    "span",
                    { className: "parent-child-avatar" },
                    child.mascot || "🎵",
                ),
                el(
                    "div",
                    { className: "name-stack" },
                    el("span", { className: "parent-child-name" }, child.name),
                    el(
                        "span",
                        { className: "parent-child-sub" },
                        "Voir les progrès ›",
                    ),
                ),
            ),
            // Bouton spécifique pour les réglages
            el(
                "button",
                {
                    className: "card-settings-btn",
                    onClick: (e) => {
                        e.stopPropagation(); // EMPÊCHE de déclencher le clic de la carte (statistiques)
                        localStorage.setItem("editingChildId", child.id);
                        this.app.navigation.goTo("parentChildSettings");
                    },
                },
                "⚙️",
            ),
        );
    }
}
