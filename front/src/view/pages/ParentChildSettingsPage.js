import { el } from "../../utils/DOMBuilder.js";
import { ApiClient } from "../../model/ApiClient.js";
import { FlashMessageManager } from "../../utils/FlashMessageManager.js";

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
                const data = await ApiClient.get(`/child/${childId}`);
                this.childData = data;
            } catch (err) {
                this.childData = { name: "Erreur" };
            } finally {
                this.isLoading = false;
            }
        }

        if (this.isLoading) {
            return el(
                "div",
                { className: "page page-centered" },
                "Chargement des réglages...",
            );
        }

        const isCurrentlyFrozen = this.childData.freeze_until
            ? new Date(this.childData.freeze_until) > new Date()
            : false;

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

                this.createSection("Permissions Sociales", [
                    this.createToggleItem(
                        "Autoriser les amis",
                        "allow-friends",
                        !!this.childData.allow_friends,
                        (e) =>
                            this.handleToggle(
                                "allow_friends",
                                e.target.checked,
                            ),
                    ),
                    this.createToggleItem(
                        "Apparaître dans la recherche",
                        "public-profile",
                        !!this.childData.is_public,
                        (e) => this.handleToggle("is_public", e.target.checked),
                    ),
                ]),

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
                        this.createToggleItem(
                            "",
                            "freeze-streak",
                            isCurrentlyFrozen,
                            (e) => this.handleFreezeStreak(e.target.checked),
                        ),
                    ),
                ]),

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

    async handleToggle(field, value) {
        const childId = this.childData.id;
        try {
            await ApiClient.patch(`/child/${childId}/settings`, {
                [field]: value,
            });
            this.childData[field] = value ? 1 : 0;
            FlashMessageManager.show("Réglages mis à jour.", "success");
        } catch (err) {
            FlashMessageManager.show("Erreur lors de la mise à jour.", "error");
        }
    }

    async handleFreezeStreak(isActive) {
        const childId = this.childData.id;
        try {
            await ApiClient.patch(`/child/${childId}/settings`, {
                freeze: isActive,
            });
            const data = await ApiClient.get(`/child/${childId}`);
            this.childData = data;
            FlashMessageManager.show(
                isActive
                    ? "Série gelée avec succès ❄️"
                    : "Gel de la série désactivé",
                "success",
            );
        } catch (err) {
            FlashMessageManager.show("Erreur lors de l'opération.", "error");
        }
    }

    handleDeleteProfile() {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le profil de ${this.childData.name} ? Cette action est irréversible.`,
            )
        ) {
            this.app.navigation.goTo("parent-home");
        }
    }
}
