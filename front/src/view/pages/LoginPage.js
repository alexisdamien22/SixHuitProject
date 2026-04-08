import { el } from "../../utils/DOMBuilder.js";
import { ICONS } from "../../constants/CreateAccountConstants.js";
import { FormHelpers } from "../../utils/FormHelpers.js";

export class LoginPage {
    constructor(app) {
        this.app = app;
    }

    render() {
        const state = this.app.model.getAuthState();
        const controller = this.app.auth;
        const isValid = FormHelpers.isLoginValid(state.loginData);
        const btnContent = state.isLoading
            ? el("span", { className: "ca-spinner" }, "Chargement...")
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
                        {
                            onSubmit: (e) => e.preventDefault(),
                            onsubmit: (e) => e.preventDefault(),
                        },
                        el("input", {
                            className: "ca-input login-input",
                            type: "email",
                            placeholder: "Ton email",
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
                            placeholder: "Ton mot de passe",
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
        const state = this.app.model.getAuthState();

        const overlay = el(
            "div",
            { className: "modal-overlay" },
            el(
                "div",
                { className: "session-modal" },
                el("h2", { className: "ca-title" }, "Mot de passe oublié"),
                el(
                    "p",
                    { style: "margin: 15px 0; color: var(--color-text-main);" },
                    "Entrez votre email pour recevoir un lien de réinitialisation.",
                ),
                el("input", {
                    type: "email",
                    id: "forgot-email-input",
                    className: "ca-input",
                    placeholder: "Ton email",
                    value: state.loginData.email || "",
                }),
                el(
                    "div",
                    { style: "display: flex; gap: 10px; margin-top: 20px;" },
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
                            className: "ca-btn-next",
                            style: "flex: 1; padding: 12px;",
                            onClick: async (e) => {
                                e.preventDefault();
                                const emailInput =
                                    document.getElementById(
                                        "forgot-email-input",
                                    );
                                const email = emailInput.value.trim();
                                if (!email)
                                    return alert("Veuillez entrer un email.");

                                const btn = e.target;
                                btn.textContent = "Envoi...";
                                btn.disabled = true;

                                try {
                                    await this.app.auth.forgotPassword(email);
                                    alert(
                                        "Si cet email existe, un lien de réinitialisation a été envoyé.",
                                    );
                                    overlay.remove();
                                } catch (err) {
                                    alert(
                                        "Erreur lors de la demande. Veuillez réessayer.",
                                    );
                                    btn.textContent = "Envoyer";
                                    btn.disabled = false;
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
