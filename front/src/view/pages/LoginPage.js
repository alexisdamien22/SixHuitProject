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
        el("p", { className: "ca-step-label" }, "Connecte-toi pour continuer"),

        el(
          "div",
          { className: "ca-illus-wrap" },
          el("img", { src: ICONS.guitare, alt: "Prêt ?" }),
          el("span", { className: "ca-illus-name" }, "Prêt ?"),
        ),

        el(
          "div",
          { className: "ca-form-block" },
          el("p", { className: "ca-question" }, "Content de te revoir !"),
          el(
            "form",
            { onSubmit: (e) => e.preventDefault() },
            el("input", {
              className: "ca-input login-input",
              type: "email",
              placeholder: "Ton email",
              value: state.loginData.email,
              onInput: (e) =>
                controller.handleInput("login", "email", e.target.value),
            }),
            el("input", {
              className: "ca-input login-input",
              type: "password",
              placeholder: "Ton mot de passe",
              value: state.loginData.password,
              onInput: (e) =>
                controller.handleInput("login", "password", e.target.value),
            }),
          ),
          el(
            "a",
            { href: "#", className: "ca-forgot-pass" },
            "Mot de passe oublié ?",
          ),
        ),

        // AJOUT DE L'ID 'ca-main-btn' ICI
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

  // LA NOUVELLE FONCTION QUI MET A JOUR UNIQUEMENT LE BOUTON
  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      const state = this.app.model.getAuthState();
      btn.disabled =
        !FormHelpers.isLoginValid(state.loginData) || state.isLoading;
    }
  }
}
