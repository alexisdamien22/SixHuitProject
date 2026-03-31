import { el } from "../../utils/DOMBuilder.js";
import {
  INSTRUMENTS,
  MASCOTTES,
  JOURS,
  STEP_ILLUS,
  TOTAL_STEPS,
} from "../../constants/CreateAccountConstants.js";
import { FormHelpers } from "../../utils/FormHelpers.js";

export class RegisterChildPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const state = this.app.model.getAuthState();
    const controller = this.app.auth;

    // --- Écran de succès final ---
    if (state.step === 8) {
      return el(
        "div",
        { className: "ca-screen ca-success flex-col" },
        el(
          "div",
          { className: "ca-success-body flex-center flex-col" },
          el(
            "div",
            { className: "ca-success-mascot" },
            state.registerData.mascotte || "🎵",
          ),
          el(
            "h2",
            { className: "ca-success-title" },
            `Bienvenue, ${state.registerData.name} !`,
          ),
        ),
        el(
          "div",
          { className: "ca-footer" },
          el(
            "button",
            {
              className: "btn-primary",
              onClick: () => this.app.navigation.goTo("home"),
            },
            "C'est parti ! 🚀",
          ),
        ),
      );
    }

    // --- Écran principal du tunnel ---
    const illus = STEP_ILLUS[state.step] || { png: "", lbl: "" };
    const isValid = FormHelpers.isChildStepValid(
      state.step,
      state.registerData,
    );

    let btnLabel = state.step === TOTAL_STEPS ? "Terminer" : "Suivant";
    if (state.isLoading)
      btnLabel = el("span", { className: "ca-spinner" }, "Chargement...");

    return el(
      "div",
      { className: "ca-screen" },
      el(
        "div",
        { className: "ca-content" },
        el("h1", { className: "ca-title" }, "Profil Enfant"),
        el(
          "p",
          { className: "ca-step-label" },
          `Étape ${state.step}/${TOTAL_STEPS}`,
        ),

        el(
          "div",
          { className: "ca-illus-wrap" },
          el("img", { src: illus.png, alt: illus.lbl }),
        ),

        el(
          "div",
          { className: "ca-form-block mt-24" },
          this.buildStepContent(state, controller),
        ),

        el(
          "button",
          {
            id: "ca-main-btn",
            className: "btn-primary mt-40",
            disabled: !isValid || state.isLoading,
            onClick: () => controller.handleNextChildStep(),
          },
          btnLabel,
        ),
      ),
    );
  }

  buildStepContent(state, controller) {
    switch (state.step) {
      case 1:
        return [
          el("p", { className: "form-label" }, "Quel est ton prénom ?"),
          el("input", {
            className: "form-input",
            type: "text",
            placeholder: "Ton prénom",
            value: state.registerData.name,
            onInput: (e) =>
              controller.handleInput("register", "name", e.target.value),
          }),
        ];
      case 2:
        return [
          el("p", { className: "form-label" }, "Quel est ton âge ?"),
          el("input", {
            className: "form-input",
            type: "number",
            placeholder: "Âge",
            value: state.registerData.age,
            onInput: (e) =>
              controller.handleInput("register", "age", e.target.value),
          }),
        ];
      case 3:
        return [
          el("p", { className: "form-label" }, "Quel instrument ?"),
          el(
            "div",
            { className: "ca-instr-grid" },
            INSTRUMENTS.map((ins) =>
              el(
                "div",
                {
                  className: `ca-instr-card ${state.registerData.instrument === ins.id ? "sel" : ""}`,
                  onClick: () => controller.handleInstrumentSelect(ins.id),
                },
                el(
                  "div",
                  { className: "ca-instr-icon" },
                  el("img", { src: ins.png, alt: ins.lbl }),
                ),
                el("span", { className: "ca-instr-lbl" }, ins.lbl),
              ),
            ),
          ),
        ];
      case 4:
        return [
          el(
            "p",
            { className: "form-label" },
            "Depuis combien d'années pratiques-tu ?",
          ),
          el("input", {
            className: "form-input",
            type: "number",
            value: state.registerData.duree,
            onInput: (e) =>
              controller.handleInput("register", "duree", e.target.value),
          }),
        ];
      case 5:
        return [
          el("p", { className: "form-label" }, "Ton école ou conservatoire ?"),
          el("input", {
            className: "form-input",
            type: "text",
            value: state.registerData.ecole,
            onInput: (e) =>
              controller.handleInput("register", "ecole", e.target.value),
          }),
        ];
      case 6:
        return [
          el("p", { className: "form-label" }, "Choisis une mascotte !"),
          el(
            "div",
            { className: "ca-mascot-grid" },
            MASCOTTES.map((m) =>
              el(
                "div",
                {
                  className: `ca-mascot-cell ${state.registerData.mascotte === m ? "sel" : ""}`,
                  onClick: () => controller.handleMascotSelect(m),
                },
                m,
              ),
            ),
          ),
        ];
      case 7:
        return [
          el(
            "p",
            { className: "form-label" },
            "Quels jours vas-tu travailler ?",
          ),
          el(
            "div",
            { className: "ca-days-row" },
            JOURS.map((j) =>
              el(
                "button",
                {
                  className: `ca-day-pill ${state.registerData.jours.includes(j) ? "sel" : ""}`,
                  onClick: () => controller.handleDayToggle(j),
                },
                j,
              ),
            ),
          ),
        ];
      default:
        return [];
    }
  }
}
