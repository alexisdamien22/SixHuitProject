import { el } from "../../utils/DOMBuilder.js";
import {
  INSTRUMENTS,
  MASCOTS,
  DAYS,
  STEP_ILLUS,
  TOTAL_STEPS,
} from "../../constants/CreateAccountConstants.js";
import { FormHelpers } from "../../utils/FormHelpers.js";

export class RegisterChildPage {
  constructor(app) {
    this.app = app;
  }

  refreshBtn() {
    const state = this.app.model.getAuthState();
    const isValid = FormHelpers.isChildStepValid(
      state.step,
      state.childRegisterData
    );

    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      btn.disabled = !isValid || state.isLoading;
    }
  }

  refreshInstrumentSelection() {
    const state = this.app.model.getAuthState();
    const cards = document.querySelectorAll(".ca-instr-card");

    cards.forEach(card => {
      const id = card.getAttribute("data-id");
      if (id === state.childRegisterData.instrument) {
        card.classList.add("sel");
      } else {
        card.classList.remove("sel");
      }
    });

    this.refreshBtn();
  }

  refreshMascotSelection() {
    const state = this.app.model.getAuthState();
    const cells = document.querySelectorAll(".ca-mascot-cell");

    cells.forEach(cell => {
      const value = cell.getAttribute("data-value");
      if (value === state.childRegisterData.mascot) {
        cell.classList.add("sel");
      } else {
        cell.classList.remove("sel");
      }
    });

    this.refreshBtn();
  }

  refreshDaysSelection() {
    const state = this.app.model.getAuthState();
    const pills = document.querySelectorAll(".ca-day-pill");

    pills.forEach(pill => {
      const value = pill.getAttribute("data-value");
      if (state.childRegisterData.days.includes(value)) {
        pill.classList.add("sel");
      } else {
        pill.classList.remove("sel");
      }
    });

    this.refreshBtn();
  }

  render() {
    const state = this.app.model.getAuthState();
    const controller = this.app.auth;

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
            state.childRegisterData.mascot || "🎵",
          ),
          el(
            "h2",
            { className: "ca-success-title" },
            `Bienvenue, ${state.childRegisterData.name} !`,
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

    const illus = STEP_ILLUS[state.step] || { png: "", lbl: "" };
    console.log("STEP =", state.step);
    console.log("CHILD DATA =", state.childRegisterData || state.registerData);
    console.log(
      "IS VALID ?",
      FormHelpers.isChildStepValid(
        state.step,
        state.childRegisterData || state.registerData
      )
    );

    const isValid = FormHelpers.isChildStepValid(
      state.step,
      state.childRegisterData,
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
            value: state.childRegisterData.name,
            onInput: (e) =>
              controller.handleInput("register-child", "name", e.target.value),
          }),
        ];
      case 2:
        return [
          el("p", { className: "form-label" }, "Quel est ton âge ?"),
          el("input", {
            className: "form-input",
            type: "number",
            placeholder: "Âge",
            value: state.childRegisterData.age,
            onInput: (e) =>
              controller.handleInput("register-child", "age", e.target.value),
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
                  className: `ca-instr-card ${state.childRegisterData.instrument === ins.id ? "sel" : ""}`,
                  "data-id": ins.id,
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
            value: state.childRegisterData.time_amount,
            onInput: (e) =>
              controller.handleInput("register-child", "time_amount", e.target.value),
          }),
        ];
      case 5:
        return [
          el("p", { className: "form-label" }, "Ton école ou conservatoire ?"),
          el("input", {
            className: "form-input",
            type: "text",
            value: state.childRegisterData.school,
            onInput: (e) =>
              controller.handleInput("register-child", "school", e.target.value),
          }),
        ];
      case 6:
        return [
          el("p", { className: "form-label" }, "Choisis une mascot !"),
          el(
            "div",
            { className: "ca-mascot-grid" },
            MASCOTS.map((m) =>
              el(
                "div",
                {
                  className: `ca-mascot-cell ${state.childRegisterData.mascot === m ? "sel" : ""}`,
                  "data-value": m,
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
            DAYS.map((j) =>
              el(
                "button",
                {
                  className: `ca-day-pill ${state.childRegisterData.days.includes(j) ? "sel" : ""}`,
                  "data-value": j,
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