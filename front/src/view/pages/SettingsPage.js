import { el } from "../../utils/DOMBuilder.js";
import { AccountSwitcher } from "./AccountSwitcher.js";
import { ApiClient } from "../../model/ApiClient.js";
import { AppViewTheme } from "../AppViewTheme.js";
import { FlashMessageManager } from "../../utils/FlashMessageManager.js";

export class SettingsPage {
    constructor(app) {
        this.app = app;
    }

    async handleChangePin() {
        this.showPasswordModal(async (password) => {
            try {
                const verifyRes = await ApiClient.post(
                    "/auth/verify-password",
                    { password },
                );

                if (verifyRes.success) {
                    AccountSwitcher.showPinPopup(
                        async (newPin, onUpdateSuccess, onUpdateError) => {
                            try {
                                const updateRes = await ApiClient.post(
                                    "/auth/update-pin",
                                    { newPin },
                                );
                                if (updateRes.success) {
                                    onUpdateSuccess();
                                    FlashMessageManager.show(
                                        "Code PIN modifié avec succès !",
                                        "success",
                                    );
                                } else {
                                    onUpdateError();
                                    FlashMessageManager.show(
                                        "Erreur lors de la modification du code PIN.",
                                        "error",
                                    );
                                }
                            } catch (e) {
                                onUpdateError();
                                FlashMessageManager.show(
                                    "Erreur inattendue.",
                                    "error",
                                );
                            }
                        },
                        "Nouveau code PIN",
                    );
                } else {
                    FlashMessageManager.show(
                        "Mot de passe incorrect.",
                        "error",
                    );
                }
            } catch (err) {}
        });
    }

    showPasswordModal(onConfirm) {
        const input = el("input", {
            type: "password",
            placeholder: "Mot de passe",
            className: "modal-input",
        });
        const confirmBtn = el(
            "button",
            { className: "modal-btn confirm" },
            "Confirmer",
        );
        const cancelBtn = el(
            "button",
            { className: "modal-btn cancel" },
            "Annuler",
        );

        const modal = el(
            "div",
            { className: "modal-overlay" },
            el(
                "div",
                { className: "modal-content" },
                el("h3", {}, "Sécurité"),
                el(
                    "p",
                    {},
                    "Veuillez saisir votre mot de passe pour modifier le PIN",
                ),
                input,
                el(
                    "div",
                    { className: "modal-actions" },
                    cancelBtn,
                    confirmBtn,
                ),
            ),
        );

        confirmBtn.onclick = () => {
            const val = input.value;
            if (val) {
                modal.remove();
                onConfirm(val);
            }
        };

        cancelBtn.onclick = () => modal.remove();
        document.body.appendChild(modal);
        input.focus();
    }

    render() {
        const isParentMode = !localStorage.getItem("activeChildId");
        const isLightMode = document.body.classList.contains("light-mode");

        const appearanceSection = this.createSection("Apparence", [
            this.createToggleItem(
                "Thème Clair",
                "theme-checkbox",
                isLightMode,
                (e) => {
                    AppViewTheme.toggle(e.target.checked);
                },
            ),
        ]);

        let specificSections = [];

        if (isParentMode) {
            specificSections = [
                this.createSection("Sécurité & Compte", [
                    this.createActionItem("Modifier mon code PIN", () =>
                        this.handleChangePin(),
                    ),
                    this.createToggleItem(
                        "Rappels par email",
                        "email-notif",
                        true,
                        () => {},
                    ),
                ]),
            ];
        } else {
            specificSections = [
                this.createSection("Expérience Musicale", [
                    this.createToggleItem(
                        "Effets sonores",
                        "sound-effects",
                        true,
                        () => {},
                    ),
                    this.createActionItem("Changer ma mascotte", () => {}),
                ]),
            ];
        }

        return el(
            "div",
            { className: "page settings-page" },
            el("h2", { className: "ca-title settings-title" }, "Paramètres"),
            el(
                "div",
                { className: "settings-container" },
                appearanceSection,
                ...specificSections,
            ),
            el(
                "button",
                {
                    className: "parent-logout-btn mt-24",
                    onClick: () => this.app.auth.logout(),
                },
                "Se déconnecter",
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
            el("span", { className: "settings-item-label" }, label),
            el(
                "label",
                { className: "theme-switch", htmlFor: id },
                el("input", {
                    type: "checkbox",
                    id: id,
                    checked: isChecked,
                    onChange: onChange,
                }),
                el("div", { className: "toggle-slider" }),
            ),
        );
    }

    createActionItem(label, onClick) {
        return el(
            "div",
            {
                className: "settings-item clickable",
                onClick: onClick,
            },
            el("span", { className: "settings-item-label" }, label),
            el("span", { className: "settings-item-arrow" }, "›"),
        );
    }
}
