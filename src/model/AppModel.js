export class AppModel {
  constructor() {
    // État global de l'authentification et de l'onboarding
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

    // Données de l'utilisateur une fois connecté
    this.activeChild = null;
    this.childrenAccounts = [];
  }

  // --- Méthodes pour l'Onboarding ---

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
