import { el } from "../../utils/DOMBuilder.js";
import { ICONS } from "../../constants/CreateAccountConstants.js";
import { FormHelpers } from "../../utils/FormHelpers.js";
import { FlashMessageManager } from "../../utils/FlashMessageManager.js";

export class LoginPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const state = this.app.model.getAuthState();
        const controller = this.app.auth;
        const isValid = FormHelpers.isLoginValid(state.loginData);
        const btnContent = state.isLoading
            ? el("span", { className: "ca-spinner" }, "...")
            : "Se connecter";

        return el(
            "div",
            { className: "ca-screen" },
            el(
                "div",
                { className: "ca-content" },
                el("h1", { className: "ca-title" }, "Connexion"),
                el(
                    "p",
                    { className: "ca-step-label" },
                    "Connecte-toi pour continuer",
                ),
                el(
                    "div",
                    { className: "ca-illus-wrap" },
                    el("img", { src: ICONS.guitare, alt: "Prêt ?" }),
                    el("span", { className: "ca-illus-name" }, "Prêt ?"),
                ),
                el(
                    "div",
                    { className: "ca-form-block" },
                    el(
                        "p",
                        { className: "ca-question" },
                        "Content de te revoir !",
                    ),
                    el(
                        "form",
                        { onSubmit: (e) => e.preventDefault() },
                        el("input", {
                            className: "ca-input login-input",
                            type: "email",
                            placeholder: "Email",
                            value: state.loginData.email,
                            onInput: (e) =>
                                controller.handleInput(
                                    "login",
                                    "email",
                                    e.target.value,
                                ),
                        }),
                        el("input", {
                            className: "ca-input login-input",
                            type: "password",
                            placeholder: "Mot de passe",
                            value: state.loginData.password,
                            onInput: (e) =>
                                controller.handleInput(
                                    "login",
                                    "password",
                                    e.target.value,
                                ),
                        }),
                    ),
                    el(
                        "a",
                        {
                            href: "#",
                            className: "ca-forgot-pass",
                            onClick: (e) => {
                                e.preventDefault();
                                this.showForgotPasswordModal();
                            },
                        },
                        "Mot de passe oublié ?",
                    ),
                ),
                el(
                    "button",
                    {
                        id: "ca-main-btn",
                        className: "ca-btn-next",
                        disabled: !isValid || state.isLoading,
                        onClick: () => controller.submitLogin(),
                    },
                    btnContent,
                ),
            ),
            el(
                "div",
                { className: "ca-footer" },
                el(
                    "p",
                    { className: "ca-login-hint" },
                    "Nouveau ici ? ",
                    el(
                        "a",
                        {
                            href: "#",
                            onClick: (e) => {
                                e.preventDefault();
                                this.app.navigation.goTo("registerParent");
                            },
                        },
                        "Crée un compte !",
                    ),
                ),
            ),
        );
    }

    showForgotPasswordModal() {
        const overlay = el(
            "div",
            { className: "modal-overlay" },
            el(
                "div",
                { className: "session-modal" },
                el("h2", { className: "ca-title" }, "Réinitialisation"),
                el(
                    "p",
                    { className: "forgot-email-prompt" },
                    "Saisissez votre email :",
                ),
                el("input", {
                    type: "email",
                    id: "forgot-email-input",
                    className: "ca-input",
                    placeholder: "Email",
                }),
                el(
                    "div",
                    { className: "forgot-email-actions" },
                    el(
                        "button",
                        {
                            className: "pin-cancel-btn",
                            onClick: () => overlay.remove(),
                        },
                        "Annuler",
                    ),
                    el(
                        "button",
                        {
                            className: "ca-btn-next flex-1",
                            onClick: async (e) => {
                                const email =
                                    document.getElementById(
                                        "forgot-email-input",
                                    ).value;
                                if (!email) return;
                                e.target.textContent = "...";
                                e.target.disabled = true;
                                try {
                                    await this.app.auth.forgotPassword(email);
                                    overlay.remove();
                                    FlashMessageManager.show(
                                        "Email de réinitialisation envoyé !",
                                        "success",
                                    );
                                } catch (err) {
                                    e.target.textContent = "Envoyer";
                                    e.target.disabled = false;
                                    FlashMessageManager.show(
                                        "Erreur lors de l'envoi de l'email.",
                                        "error",
                                    );
                                }
                            },
                        },
                        "Envoyer",
                    ),
                ),
            ),
        );
        document.body.appendChild(overlay);
    }

    refreshBtn() {
        const btn = document.getElementById("ca-main-btn");
        if (btn) {
            const state = this.app.model.getAuthState();
            btn.disabled =
                !FormHelpers.isLoginValid(state.loginData) || state.isLoading;
        }
    }
}
