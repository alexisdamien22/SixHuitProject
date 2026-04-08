import { el } from "../../utils/DOMBuilder.js";
import { ApiClient } from "../../model/ApiClient.js";

export class ParentChildSettingsPage {
    constructor(app) {
        this.app = app;
        this.childData = null;
        this.isLoading = true;
    }

    async render() {
        const childId = localStorage.getItem("editingChildId");

        if (!this.childData || this.childData.id != childId) {
            this.isLoading = true;
            try {
                // On récupère les données actuelles de l'enfant (y compris permissions si tu les as en DB)
                const data = await ApiClient.get(`/child/${childId}`);
                this.childData = data;
            } catch (err) {
                this.childData = { name: "Erreur" };
            } finally {
                this.isLoading = false;
            }
        }

        if (this.isLoading)
            return el(
                "div",
                { className: "page page-centered" },
                "Chargement des réglages...",
            );

        return el(
            "div",
            { className: "page parent-settings-page" },
            el(
                "div",
                { className: "details-header" },
                el(
                    "button",
                    {
                        className: "back-circle-btn",
                        onClick: () => this.app.navigation.goTo("parent-home"),
                    },
                    "‹",
                ),
                el(
                    "div",
                    { className: "header-info" },
                    el("h2", { className: "ca-title" }, "Réglages"),
                    el(
                        "p",
                        { className: "subtitle" },
                        `Profil de ${this.childData.name}`,
                    ),
                ),
            ),

            el(
                "div",
                { className: "settings-container" },

                // Section Sociale
                this.createSection("Permissions Sociales", [
                    this.createToggleItem(
                        "Autoriser les amis",
                        "allow-friends",
                        true, // À lier à ta DB plus tard
                        (e) => console.log("Amis:", e.target.checked),
                    ),
                    this.createToggleItem(
                        "Apparaître dans la recherche",
                        "public-profile",
                        false,
                        (e) => console.log("Public:", e.target.checked),
                    ),
                ]),

                // Section Protection de la Série
                this.createSection("Série & Motivation", [
                    el(
                        "div",
                        { className: "settings-card-special" },
                        el(
                            "div",
                            { className: "special-info" },
                            el("h4", {}, "❄️ Geler la série"),
                            el(
                                "p",
                                {},
                                "Activez cette option pour une pause d'une semaine. La série (streak) ne sera pas perdue même si l'enfant ne joue pas.",
                            ),
                        ),
                        this.createToggleItem("", "freeze-streak", false, (e) =>
                            this.handleFreezeStreak(e.target.checked),
                        ),
                    ),
                ]),

                // Section Danger
                this.createSection("Zone de danger", [
                    el(
                        "button",
                        {
                            className: "danger-action-btn",
                            onClick: () => this.handleDeleteProfile(),
                        },
                        "Supprimer le profil de " + this.childData.name,
                    ),
                ]),
            ),
        );
    }

    createSection(title, items) {
        return el(
            "div",
            { className: "settings-section" },
            el("h3", { className: "settings-section-title" }, title),
            el("div", { className: "settings-card" }, ...items),
        );
    }

    createToggleItem(label, id, isChecked, onChange) {
        return el(
            "div",
            { className: "settings-item" },
            label
                ? el("span", { className: "settings-item-label" }, label)
                : "",
            el(
                "label",
                { className: "theme-switch", htmlFor: id },
                el("input", {
                    type: "checkbox",
                    id: id,
                    checked: isChecked,
                    onChange: onChange,
                }),
                el("div", { className: "slider" }),
            ),
        );
    }

    async handleFreezeStreak(isActive) {
        // Logique API pour geler la streak
        alert(isActive ? "Série gelée pour 7 jours !" : "Série dégelée.");
    }

    handleDeleteProfile() {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le profil de ${this.childData.name} ? Cette action est irréversible.`,
            )
        ) {
            // Logique API delete
            this.app.navigation.goTo("parent-home");
        }
    }
}
