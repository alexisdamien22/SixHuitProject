import { el } from "../../utils/DOMBuilder.js";
import { AccountSwitcher } from "./AccountSwitcher.js";
import { ApiClient } from "../../model/ApiClient.js";
import { AppViewTheme } from "../AppViewTheme.js";

export class SettingsPage {
    constructor(app) {
        this.app = app;
    }
    handleChangePin() {
        AccountSwitcher.showPinPopup(async (newPin, onSuccess, onError) => {
            try {
                const res = await ApiClient.post("/auth/update-pin", {
                    newPin,
                });
                if (res.success) {
                    onSuccess();
                    setTimeout(
                        () => alert("Code PIN modifié avec succès !"),
                        100,
                    );
                } else {
                    onError();
                }
            } catch (e) {
                console.error(e);
                onError();
            }
        }, "Nouveau code PIN");
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

        let specificSections;

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
                        () => console.log("Action: Toggle Email"),
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
                        () => console.log("Action: Toggle Sound"),
                    ),
                    this.createActionItem("Changer ma mascotte", () =>
                        console.log("Action: Changer Mascotte"),
                    ),
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
                el("div", { className: "slider" }),
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
