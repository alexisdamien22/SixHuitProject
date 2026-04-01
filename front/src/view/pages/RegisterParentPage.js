import { el } from "../../utils/DOMBuilder.js";
import { STEP_ILLUS } from "../../constants/CreateAccountConstants.js";
import { FormHelpers } from "../../utils/FormHelpers.js";

export class RegisterParentPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const state = this.app.model.getAuthState();
    const controller = this.app.auth;
    const illus = STEP_ILLUS[1];
    const isValid = FormHelpers.isParentValid(state.registerData);
    const btnContent = state.isLoading
      ? el("span", { className: "ca-spinner" }, "Chargement...")
      : "Créer mon compte";

    return el(
      "div",
      { className: "ca-screen" },
      el(
        "div",
        { className: "ca-content" },
        el("h1", { className: "ca-title" }, "Création de compte"),
        el("p", { className: "ca-step-label" }, "Compte Parent"),

        el(
          "div",
          { className: "ca-illus-wrap" },
          el("img", { src: illus.png, alt: illus.lbl }),
        ),

        el(
          "div",
          { className: "ca-form-block" },
          el("p", { className: "ca-question" }, "Tes identifiants"),
          el(
            "form",
            {
              onSubmit: (e) => e.preventDefault(),
              onsubmit: (e) => e.preventDefault(),
            },
            el("input", {
              className: "ca-input reg-input",
              type: "email",
              placeholder: "Ton email",
              value: state.registerData.email,
              onInput: (e) =>
                controller.handleInput(
                  "register-parent",
                  "email",
                  e.target.value,
                ),
            }),
            el("input", {
              className: "ca-input reg-input",
              type: "password",
              placeholder: "Mot de passe (8+ car.)",
              value: state.registerData.password,
              onInput: (e) =>
                controller.handleInput(
                  "register-parent",
                  "password",
                  e.target.value,
                ),
            }),
            el("input", {
              className: "ca-input reg-input",
              type: "password",
              placeholder: "Confirmer le mot de passe",
              value: state.registerData.confirmPassword || "",
              onInput: (e) =>
                controller.handleInput(
                  "register-parent",
                  "confirmPassword",
                  e.target.value,
                ),
            }),
          ),
        ),

        el(
          "button",
          {
            id: "ca-main-btn",
            className: "ca-btn-next",
            disabled: !isValid || state.isLoading,
            onClick: () => controller.submitParentRegistration(),
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
          "Déjà inscrit ? ",
          el(
            "a",
            {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                this.app.navigation.goTo("login");
              },
            },
            "Connecte-toi !",
          ),
        ),
      ),
    );
  }

  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      const state = this.app.model.getAuthState();
      btn.disabled =
        !FormHelpers.isParentValid(state.registerData) || state.isLoading;
    }
  }
}
