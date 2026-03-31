import { SessionStore } from "./SessionStore.js";

export class AppModel {
  constructor() {
    this.session = new SessionStore();
    this.childData = null;

    // --- ÉTAT DE L'ONBOARDING (Création de compte / Connexion) ---
    this.authState = {
      step: 1,
      isLoginMode: true,
      isLoading: false,
      loginData: { email: "", password: "" },
      registerData: {
        email: "",
        password: "",
        name: "",
        age: "",
        instrument: "",
        duree: "",
        ecole: "",
        mascotte: "",
        jours: [],
      },
    };
  }

  // --- Gestion de Session ---
  async loadSession() {
    console.log("Chargement de la session…");
    this.session.load();
  }

  setChildData(data) {
    this.childData = data;
  }

  getChildData() {
    return this.childData;
  }

  // --- Logique du Modèle d'Authentification ---
  getAuthState() {
    return this.authState;
  }

  updateAuthData(mode, field, value) {
    if (mode === "login") {
      this.authState.loginData[field] = value;
    } else {
      this.authState.registerData[field] = value;
    }
  }

  toggleLoginMode() {
    this.authState.isLoginMode = !this.authState.isLoginMode;
    this.authState.step = 1;
  }

  setAuthStep(step) {
    this.authState.step = step;
  }

  setLoading(isLoading) {
    this.authState.isLoading = isLoading;
  }

  toggleRegisterDay(day) {
    const jours = this.authState.registerData.jours;
    const index = jours.indexOf(day);
    if (index === -1) jours.push(day);
    else jours.splice(index, 1);
  }
}
