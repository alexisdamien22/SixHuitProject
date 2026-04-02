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
    const step = state.step || 1;
    const illus = STEP_ILLUS[1];

    let isValid = false;
    if (step === 1) {
      isValid = FormHelpers.isParentValid(state.registerData);
    } else {
      isValid = state.registerData.pin && state.registerData.pin.length === 4;
    }

    const btnContent = state.isLoading
      ? el("span", { className: "ca-spinner" }, "Chargement...")
      : step === 1
        ? "Suivant"
        : "Créer mon compte";

    return el(
      "div",
      { className: "ca-screen" },
      el(
        "div",
        { className: "ca-content" },
        el("h1", { className: "ca-title" }, "Création de compte"),
        el(
          "p",
          { className: "ca-step-label" },
          step === 1 ? "Étape 1/2 : Identifiants" : "Étape 2/2 : Code PIN",
        ),

        el(
          "div",
          { className: "ca-illus-wrap" },
          el("img", { src: illus.png, alt: illus.lbl }),
        ),

        el(
          "div",
          { className: "ca-form-block" },
          step === 1
            ? this.buildStep1(state, controller)
            : this.buildStep2(state, controller),
        ),

        el(
          "button",
          {
            id: "ca-main-btn",
            className: "ca-btn-next",
            disabled: !isValid || state.isLoading,
            onClick: () => controller.handleNextParentStep(),
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

  buildStep1(state, controller) {
    return [
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
            controller.handleInput("register-parent", "email", e.target.value),
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
    ];
  }

  buildStep2(state, controller) {
    const currentPin = state.registerData.pin || "";

    const hiddenInput = el("input", {
      id: "hidden-pin-input",
      type: "text",
      inputMode: "numeric",
      maxLength: 4,
      value: currentPin,
      className: "ca-pin-hidden-input",
      onInput: (e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
        controller.handleInput("register-parent", "pin", val);
      },
    });

    const pinDisplay = el(
      "div",
      {
        id: "pin-display-container",
        className: "ca-pin-display-container",
        onClick: () => {
          const input = document.getElementById("hidden-pin-input");
          if (input) input.focus();
        },
      },
      ...Array.from({ length: 4 }).map((_, i) =>
        el(
          "div",
          {
            className: `ca-pin-dot ${i < currentPin.length ? "filled" : ""}`,
          },
          i < currentPin.length ? currentPin[i] : "",
        ),
      ),
    );

    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
    const keypad = el(
      "div",
      {
        className: "ca-pin-keypad",
      },
      ...keys.map((key) => {
        if (key === "") return el("div");

        return el(
          "button",
          {
            className: "pin-key",
            onClick: (e) => {
              e.preventDefault();
              const pin = state.registerData.pin || "";
              if (key === "⌫") {
                controller.handleInput(
                  "register-parent",
                  "pin",
                  pin.slice(0, -1),
                );
              } else if (pin.length < 4) {
                controller.handleInput("register-parent", "pin", pin + key);
              }
              const input = document.getElementById("hidden-pin-input");
              if (input) input.focus();
            },
          },
          key,
        );
      }),
    );

    setTimeout(() => {
      const input = document.getElementById("hidden-pin-input");
      if (input) input.focus();
    }, 50);

    return [
      hiddenInput,
      el("p", { className: "ca-question" }, "Crée ton code PIN (4 chiffres)"),
      el(
        "p",
        { className: "ca-pin-desc" },
        "Il sécurisera l'accès à ton Espace Parent.",
      ),
      pinDisplay,
      keypad,
    ];
  }

  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      const state = this.app.model.getAuthState();
      const step = state.step || 1;
      let isValid = false;
      if (step === 1) {
        isValid = FormHelpers.isParentValid(state.registerData);
      } else {
        isValid = state.registerData.pin && state.registerData.pin.length === 4;
      }
      btn.disabled = !isValid || state.isLoading;

      const pinDisplay = document.getElementById("pin-display-container");
      if (pinDisplay) {
        const currentPin = state.registerData.pin || "";
        const dots = pinDisplay.children;
        for (let i = 0; i < 4; i++) {
          const isFilled = i < currentPin.length;
          if (isFilled) {
            dots[i].classList.add("filled");
          } else {
            dots[i].classList.remove("filled");
          }
          dots[i].textContent = isFilled ? currentPin[i] : "";
        }

        const hiddenInput = document.getElementById("hidden-pin-input");
        if (hiddenInput && hiddenInput.value !== currentPin) {
          hiddenInput.value = currentPin;
        }
      }
    }
  }
}
