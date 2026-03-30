import {
  INSTRUMENTS,
  STEP_ILLUS,
  MASCOTTES,
  JOURS,
  TOTAL_STEPS,
  ICONS,
} from "../../constants/CreateAccountConstants.js";
import { esc, isStepValid } from "../../utils/FormHelpers.js";

const state = {
  step: 1,
  isLoginMode: true,
  isLoading: false,
  loginData: { email: "", password: "" },
  registerData: {
    name: "",
    age: "",
    instrument: "",
    duree: "",
    ecole: "",
    mascotte: "",
    jours: [],
    email: "",
    password: "",
  },
};

function buildFormContent() {
  if (state.isLoginMode) {
    return `
      <p class="ca-question">Content de te revoir !</p>
      <form id="ca-login-form">
        <input class="ca-input login-input" type="email" autocomplete="username" data-field="email" 
          placeholder="Ton email" value="${esc(state.loginData.email)}">
        <input class="ca-input login-input" type="password" autocomplete="current-password" data-field="password" 
          placeholder="Ton mot de passe" value="${esc(state.loginData.password)}">
      </form>
      <a href="#" class="ca-forgot-pass">Mot de passe oublié ?</a>`;
  }

  switch (state.step) {
    case 1:
      return `
        <p class="ca-question">Infos du <em>parent</em> (pour le compte)</p>
        <input class="ca-input reg-input" type="email" data-field="email" placeholder="Email du parent" value="${esc(state.registerData.email)}">
        <input class="ca-input reg-input" type="password" data-field="password" placeholder="Mot de passe (8+ car.)" value="${esc(state.registerData.password)}">
        <p class="ca-question" style="margin-top: 24px;">Quel est ton <em>prénom</em> ?</p>
        <input class="ca-input reg-input" type="text" data-field="name" placeholder="Prénom de l'enfant" value="${esc(state.registerData.name)}">`;
    case 2:
      return `<p class="ca-question">Quel est ton <em>âge</em> ?</p>
              <input class="ca-input reg-input" type="number" data-field="age" placeholder="Âge" value="${esc(state.registerData.age)}">`;
    case 3:
      const cards = INSTRUMENTS.map(
        (ins) => `
        <div class="ca-instr-card ${state.registerData.instrument === ins.id ? "sel" : ""}" data-id="${ins.id}">
          <div class="ca-instr-icon"><img src="${ins.png}" alt="${ins.lbl}"/></div>
          <span class="ca-instr-lbl">${ins.lbl}</span>
        </div>`,
      ).join("");
      return `<p class="ca-question">Quel <em>instrument</em> ?</p><div class="ca-instr-grid">${cards}</div>`;
    case 4:
      return `<p class="ca-question">Depuis <em>combien d'années</em> pratiques-tu ?</p>
              <input class="ca-input reg-input" type="number" data-field="duree" value="${esc(state.registerData.duree)}">`;
    case 5:
      return `<p class="ca-question">Ton <em>école</em> ou conservatoire ?</p>
              <input class="ca-input reg-input" type="text" data-field="ecole" value="${esc(state.registerData.ecole)}">`;
    case 6:
      const cells = MASCOTTES.map(
        (m) => `
        <div class="ca-mascot-cell ${state.registerData.mascotte === m ? "sel" : ""}" data-mascot="${m}">${m}</div>`,
      ).join("");
      return `<p class="ca-question">Choisis une <em>mascotte</em> !</p><div class="ca-mascot-grid">${cells}</div>`;
    case 7:
      const pills = JOURS.map(
        (j) => `
        <button class="ca-day-pill ${state.registerData.jours.includes(j) ? "sel" : ""}" data-day="${j}">${j}</button>`,
      ).join("");
      return `<p class="ca-question">Quels jours vas-tu <em>travailler</em> ?</p><div class="ca-days-row">${pills}</div>`;
    default:
      return "";
  }
}

export const CreateAccountPage = {
  getHTML() {
    if (!state.isLoginMode && state.step === 8) {
      return `
        <div class="ca-screen ca-success">
          <div class="ca-success-body">
            <div class="ca-success-mascot">${state.registerData.mascotte || "🎵"}</div>
            <h2 class="ca-success-title">Bienvenue, ${esc(state.registerData.name)} !</h2>
          </div>
          <div class="ca-footer"><button class="ca-btn-next" id="ca-btn-start">Commencer l'aventure 🚀</button></div>
        </div>`;
    }

    const title = state.isLoginMode ? "Connexion" : "Création de compte";
    const subTitle = state.isLoginMode
      ? "Connecte-toi pour continuer"
      : `${state.step}/${TOTAL_STEPS}`;

    let btnLabel = state.isLoginMode
      ? "Se connecter"
      : state.step === TOTAL_STEPS
        ? "Terminé !"
        : "Suivant";
    if (state.isLoading) btnLabel = `<span class="ca-spinner"></span>`;

    const illus = state.isLoginMode
      ? { png: ICONS.guitare, lbl: "Prêt ?" }
      : STEP_ILLUS[state.step];
    const valid = isStepValid(
      state.step,
      state.isLoginMode,
      state.isLoading,
      state.registerData,
      state.loginData,
    );

    return `
      <div class="ca-screen">
        <div class="ca-content">
          <h1 class="ca-title">${title}</h1>
          <p class="ca-step-label">${subTitle}</p>
          <div class="ca-illus-wrap"><img src="${illus.png}" alt="${illus.lbl}"/> <span class="ca-illus-name">${illus.lbl}</span></div>
          <div class="ca-form-block">${buildFormContent()}</div>
          <button class="ca-btn-next" id="ca-main-btn" ${valid ? "" : "disabled"}>${btnLabel}</button>
        </div>
        <div class="ca-footer">
          <p class="ca-login-hint">
            ${
              state.isLoginMode
                ? 'Nouveau ici ? <a href="#" id="ca-switch-mode">Crée un compte !</a>'
                : 'Déjà inscrit ? <a href="#" id="ca-switch-mode">Connecte-toi !</a>'
            }
          </p>
        </div>
      </div>`;
  },

  afterRender() {
    this.attachEventListeners();
  },

  attachEventListeners() {
    const loginForm = document.getElementById("ca-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => e.preventDefault());
    }

    const switchModeBtn = document.getElementById("ca-switch-mode");
    if (switchModeBtn) {
      switchModeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (state.isLoading) return;
        state.isLoginMode = !state.isLoginMode;
        state.step = 1;
        window.appController?.navigateToPage("createAccount");
      });
    }

    const mainBtn = document.getElementById("ca-main-btn");
    if (mainBtn) {
      mainBtn.addEventListener("click", () => this.handleMainAction());
    }

    document.querySelectorAll(".login-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        state.loginData[e.target.dataset.field] = e.target.value;
        this.refreshBtn();
      });
    });

    document.querySelectorAll(".reg-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        state.registerData[e.target.dataset.field] = e.target.value;
        this.refreshBtn();
      });
    });

    document.querySelectorAll(".ca-instr-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        state.registerData.instrument = e.currentTarget.dataset.id;
        window.appController?.navigateToPage("createAccount");
      });
    });

    document.querySelectorAll(".ca-mascot-cell").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        state.registerData.mascotte = e.currentTarget.dataset.mascot;
        window.appController?.navigateToPage("createAccount");
      });
    });

    document.querySelectorAll(".ca-day-pill").forEach((pill) => {
      pill.addEventListener("click", (e) => {
        const day = e.currentTarget.dataset.day;
        const idx = state.registerData.jours.indexOf(day);
        if (idx === -1) state.registerData.jours.push(day);
        else state.registerData.jours.splice(idx, 1);
        window.appController?.navigateToPage("createAccount");
      });
    });
  },

  async handleMainAction() {
    if (
      !isStepValid(
        state.step,
        state.isLoginMode,
        state.isLoading,
        state.registerData,
        state.loginData,
      ) ||
      state.isLoading
    )
      return;

    if (state.isLoginMode || state.step === TOTAL_STEPS) {
      state.isLoading = true;
      window.appController?.navigateToPage("createAccount");

      try {
        const url = state.isLoginMode
          ? "/api/auth/login"
          : "/api/auth/register";
        const body = state.isLoginMode ? state.loginData : state.registerData;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const res = await response.json();

        if (res.success) {
          localStorage.setItem("jwt_token", res.token);
          window.appController?.model.login();

          if (!state.isLoginMode) {
            localStorage.setItem("activeChildId", res.childId);
            state.step = 8;
            state.isLoading = false;
            window.appController?.navigateToPage("createAccount");
          } else {
            state.isLoading = false;
            localStorage.removeItem("activeChildId");
            window.appController?.navigateToPage("home");
          }
        } else {
          state.isLoading = false;
          alert(res.error || "Une erreur est survenue.");
          window.appController?.navigateToPage("createAccount");
        }
      } catch (err) {
        state.isLoading = false;
        alert("Erreur réseau. Veuillez vérifier votre connexion.");
        window.appController?.navigateToPage("createAccount");
      }
    } else {
      state.step++;
      window.appController?.navigateToPage("createAccount");
    }
  },

  refreshBtn() {
    const btn = document.getElementById("ca-main-btn");
    if (btn) {
      btn.disabled = !isStepValid(
        state.step,
        state.isLoginMode,
        state.isLoading,
        state.registerData,
        state.loginData,
      );
    }
  },
};
