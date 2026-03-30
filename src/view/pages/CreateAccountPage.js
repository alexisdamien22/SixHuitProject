import { el } from "../../utils/DOMBuilder.js";
import {
  INSTRUMENTS,
  STEP_ILLUS,
  MASCOTTES,
  JOURS,
  TOTAL_STEPS,
  ICONS,
} from "../../constants/CreateAccountConstants.js";
import { isStepValid } from "../../utils/FormHelpers.js";

export const CreateAccountPage = {
  // La Vue reçoit l'état et le contrôleur en paramètres
  render(state, controller) {
    // --- Écran de succès final ---
    if (!state.isLoginMode && state.step === 8) {
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
              onClick: () => window.appController.navigateToPage("home"),
            },
            "Commencer l'aventure 🚀",
          ),
        ),
      );
    }

    // --- Écran principal (Formulaire) ---
    const titleText = state.isLoginMode ? "Connexion" : "Création de compte";
    const subTitleText = state.isLoginMode
      ? "Connecte-toi pour continuer"
      : `${state.step}/${TOTAL_STEPS}`;
    const btnLabel = state.isLoginMode
      ? "Se connecter"
      : state.step === TOTAL_STEPS
        ? "Terminé !"
        : "Suivant";
    const illus = state.isLoginMode
      ? { png: ICONS.guitare, lbl: "Prêt ?" }
      : STEP_ILLUS[state.step];

    const isValid = isStepValid(
      state.step,
      state.isLoginMode,
      state.isLoading,
      state.registerData,
      state.loginData,
    );
    const btnContent = state.isLoading
      ? el("span", { className: "ca-spinner" }, "Chargement...")
      : btnLabel;

    return el(
      "div",
      { className: "ca-screen" },
      el(
        "div",
        { className: "ca-content" },
        el("h1", { className: "ca-title" }, titleText),
        el("p", { className: "ca-step-label" }, subTitleText),
        el(
          "div",
          { className: "ca-illus-wrap" },
          el("img", { src: illus.png, alt: illus.lbl }),
          el("span", { className: "ca-illus-name" }, illus.lbl),
        ),
        el(
          "div",
          { className: "ca-form-block" },
          this.buildFormContent(state, controller),
        ),
        el(
          "button",
          {
            className: "btn-primary",
            disabled: !isValid,
            onClick: () => controller.handleMainAction(),
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
          state.isLoginMode ? "Nouveau ici ? " : "Déjà inscrit ? ",
          el(
            "a",
            { href: "#", onClick: (e) => controller.handleSwitchMode(e) },
            state.isLoginMode ? "Crée un compte !" : "Connecte-toi !",
          ),
        ),
      ),
    );
  },

  buildFormContent(state, controller) {
    if (state.isLoginMode) {
      return [
        el("p", { className: "form-label" }, "Content de te revoir !"),
        el(
          "form",
          { onSubmit: (e) => e.preventDefault() },
          el("input", {
            className: "form-input",
            type: "email",
            placeholder: "Ton email",
            value: state.loginData.email,
            onInput: (e) =>
              controller.handleInput("login", "email", e.target.value),
          }),
          el("input", {
            className: "form-input",
            type: "password",
            placeholder: "Ton mot de passe",
            value: state.loginData.password,
            onInput: (e) =>
              controller.handleInput("login", "password", e.target.value),
          }),
        ),
      ];
    }

    switch (state.step) {
      case 1:
        return [
          el("p", { className: "form-label" }, "Infos du parent"),
          el("input", {
            className: "form-input",
            type: "email",
            placeholder: "Email du parent",
            value: state.registerData.email,
            onInput: (e) =>
              controller.handleInput("register", "email", e.target.value),
          }),
          el("input", {
            className: "form-input",
            type: "password",
            placeholder: "Mot de passe (8+ car.)",
            value: state.registerData.password,
            onInput: (e) =>
              controller.handleInput("register", "password", e.target.value),
          }),
          el("p", { className: "form-label mt-24" }, "Quel est ton prénom ?"),
          el("input", {
            className: "form-input",
            type: "text",
            placeholder: "Prénom de l'enfant",
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
  },
};
