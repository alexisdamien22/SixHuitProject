import { ApiClient } from "../model/ApiClient.js";

export class AuthController {
  constructor(app) {
    this.app = app;
  }

  handleInput(mode, field, value) {
    this.app.model.updateAuthData(mode, field, value);

    if (
      this.app.view.currentPage &&
      typeof this.app.view.currentPage.refreshBtn === "function"
    ) {
      this.app.view.currentPage.refreshBtn();
    }
  }

  handleInstrumentSelect(instrumentId) {
    this.app.model.updateAuthData("register", "instrument", instrumentId);
    this.triggerRender();
  }

  handleMascotSelect(mascot) {
    this.app.model.updateAuthData("register", "mascotte", mascot);
    this.triggerRender();
  }

  handleDayToggle(day) {
    this.app.model.toggleRegisterDay(day);
    this.triggerRender();
  }

  // --- SOUMISSIONS SPECIFIQUES ---

  async submitLogin() {
    const state = this.app.model.getAuthState();
    if (state.isLoading) return;

    this.app.model.setLoading(true);
    this.triggerRender();

    try {
      const result = await ApiClient.post(`/auth/login`, {
        email: state.loginData.email,
        password: state.loginData.password,
      });

      if (result.error) throw new Error(result.error);

      this.app.model.session.saveSession({
        token: result.token,
        adultId: result.adultId,
      });

      this.app.model.setLoading(false);
      // On redirige vers l'espace parent (ou home) une fois connecté
      this.app.navigation.goTo("home");
    } catch (err) {
      this.app.model.setLoading(false);
      alert(err.message || "Identifiants incorrects.");
      this.triggerRender();
    }
  }

  async submitParentRegistration() {
    const state = this.app.model.getAuthState();
    if (state.isLoading) return;

    this.app.model.setLoading(true);
    this.triggerRender();

    try {
      // ⚠️ Note : On enregistre seulement le parent ici, sans l'enfant
      const result = await ApiClient.post(`/auth/register`, {
        email: state.registerData.email,
        password: state.registerData.password,
      });

      if (result.error) throw new Error(result.error);

      this.app.model.session.saveSession({
        token: result.token,
        adultId: result.userId || result.adultId,
      });

      this.app.model.setLoading(false);
      // Une fois le parent créé, on le pousse à créer un enfant
      this.app.navigation.goTo("registerChild");
    } catch (err) {
      this.app.model.setLoading(false);
      alert(err.message || "Erreur lors de la création du compte.");
      this.triggerRender();
    }
  }

  async handleNextChildStep() {
    const state = this.app.model.getAuthState();

    if (state.step < 7) {
      // On passe à l'étape suivante du formulaire enfant
      this.app.model.setAuthStep(state.step + 1);
      this.triggerRender();
    } else {
      // Dernière étape (7), on soumet l'enfant à l'API
      await this.submitChildRegistration();
    }
  }

  async submitChildRegistration() {
    const state = this.app.model.getAuthState();
    if (state.isLoading) return;

    this.app.model.setLoading(true);
    this.triggerRender();

    try {
      // Formater la payload pour coller à ton API backend
      const payload = {
        name: state.registerData.name,
        age: parseInt(state.registerData.age) || null,
        instrument: state.registerData.instrument,
        duree: parseInt(state.registerData.duree) || null,
        ecole: state.registerData.ecole,
        mascotte: state.registerData.mascotte,
        jours: state.registerData.jours,
      };

      const token = this.app.model.session.getToken();

      // Ici, nous devrons adapter ApiClient pour envoyer le Bearer token
      // Pour l'instant, on utilise fetch direct comme dans ton ancien projet
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/auth/register-child`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Crucial pour la sécurité backend
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.error || "Erreur création enfant");

      // On mémorise l'enfant actif
      localStorage.setItem("activeChildId", result.childId);

      this.app.model.setAuthStep(8); // Écran de succès
      this.app.model.setLoading(false);
      this.triggerRender();
    } catch (err) {
      this.app.model.setLoading(false);
      alert(err.message || "Erreur réseau");
      this.triggerRender();
    }
  }

  logout() {
    this.app.model.session.clear();
    localStorage.removeItem("activeChildId");
    this.app.model.setAuthStep(1); // Reset l'état
    this.app.navigation.goTo("login");
  }

  triggerRender() {
    // Demande à la vue de rafraîchir la page courante (Architecture réactive)
    if (this.app.view.currentPage) {
      // On regénère l'affichage en remplaçant l'ancien
      this.app.view.appRoot.replaceChildren(this.app.view.currentPage.render());
    }
  }
}
