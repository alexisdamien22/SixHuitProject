import { SessionStore } from "./SessionStore.js";

export class AppModel {
  constructor() {
    this.session = new SessionStore();
    this.childData = null;

    this.authState = {
      step: 1,
      isLoginMode: true,
      isLoading: false,
      loginData: { email: "", password: "" },
      registerData: {
        email: "",
        password: "",
      },
      childRegisterData: {
        name: "",
        age: "",
        instrument: "",
        time_amount: "",
        school: "",
        mascot: "",
        days: [],
      },
    };
  }

  async loadSession() {
    console.log("Chargement de la session…");
    this.session.load();
  }

  getParentData() {
    return this.session.parentData || null;
  }

  setChildData(data) {
    this.childData = data;
  }

  getChildData() {
    return this.childData;
  }

  getAuthState() {
    return this.authState;
  }

  updateAuthData(mode, field, value) {
    if (mode === "login") {
      this.authState.loginData[field] = value;
    } else if (mode === "register-parent") {
      this.authState.registerData[field] = value;
    } else if (mode === "register-child") {
      this.authState.childRegisterData[field] = value;
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
    const days = this.authState.childRegisterData.days;
    const index = days.indexOf(day);
    if (index === -1) days.push(day);
    else days.splice(index, 1);
  }
  async fetchChildrenAccounts() {
    try {
      const token = this.session.getToken();
      if (!token) return;

      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${apiUrl}/parent/children`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.childrenAccounts = result.children;
      } else {
        this.childrenAccounts = [];
        console.error("[AppModel] Erreur renvoyée par l'API :", result.error);
      }
    } catch (error) {
      console.error(
        "[AppModel] Erreur de communication avec le serveur :",
        error,
      );
      this.childrenAccounts = [];
    }
  }
}
