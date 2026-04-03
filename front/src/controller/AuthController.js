import { ApiClient } from "../model/ApiClient.js";
import { AccountSwitcher } from "../view/pages/AccountSwitcher.js";

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
    this.app.model.updateAuthData("register-child", "instrument", instrumentId);

    if (
      this.app.view.currentPage &&
      typeof this.app.view.currentPage.refreshInstrumentSelection === "function"
    ) {
      this.app.view.currentPage.refreshInstrumentSelection();
    }
  }

  handleMascotSelect(mascot) {
    this.app.model.updateAuthData("register-child", "mascot", mascot);

    if (
      this.app.view.currentPage &&
      typeof this.app.view.currentPage.refreshMascotSelection === "function"
    ) {
      this.app.view.currentPage.refreshMascotSelection();
    }
  }

  handleDayToggle(day) {
    this.app.model.toggleRegisterDay(day);

    if (
      this.app.view.currentPage &&
      typeof this.app.view.currentPage.refreshDaysSelection === "function"
    ) {
      this.app.view.currentPage.refreshDaysSelection();
    }
  }

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

      if (!result || result.error || !result.token) {
        throw new Error(
          result?.error ||
            "Erreur de communication avec le serveur (Base de données injoignable).",
        );
      }

      this.app.model.session.saveSession({
        token: result.token,
        adultId: result.adultId,
        childId: result.childId,
      });

      this.app.model.setLoading(false);

      if (this.app.model.session.isParent()) {
        this.app.navigation.goTo("parent-home");
      } else {
        await this.app.child.loadChildData();
        this.app.navigation.goTo("home");
      }
    } catch (err) {
      this.app.model.setLoading(false);
      alert(err.message || "Identifiants incorrects.");
      this.triggerRender();
    }
  }

  async handleNextParentStep() {
    const state = this.app.model.getAuthState();
    const step = state.step || 1;

    if (step === 1) {
      this.app.model.setAuthStep(2);
      this.triggerRender();
    } else {
      await this.submitParentRegistration();
    }
  }

  async submitParentRegistration() {
    const state = this.app.model.getAuthState();
    if (state.isLoading) return;

    this.app.model.setLoading(true);
    this.triggerRender();

    try {
      const result = await ApiClient.post(`/auth/register-adult`, {
        email: state.registerData.email,
        password: state.registerData.password,
        pin: state.registerData.pin,
      });

      if (!result || result.error || (!result.token && !result.adultId)) {
        throw new Error(
          result?.error ||
            "Erreur lors de la création (Base de données injoignable).",
        );
      }

      this.app.model.session.saveSession({
        token: result.token,
        adultId: result.userId || result.adultId,
      });

      this.app.model.setLoading(false);
      this.app.navigation.goTo("parent-home");
    } catch (err) {
      this.app.model.setLoading(false);
      alert(err.message || "Erreur lors de la création du compte.");
      this.triggerRender();
    }
  }

  async handleNextChildStep() {
    const state = this.app.model.getAuthState();

    if (state.step < 7) {
      this.app.model.setAuthStep(state.step + 1);
      this.triggerRender();
    } else {
      await this.submitChildRegistration();
    }
  }

  async handleSwitchToParent() {
    try {
      const profile = await ApiClient.get("/auth/profile");

      if (profile && profile.hasPin) {
        AccountSwitcher.showPinPopup(async (enteredPin, onSuccess, onError) => {
          try {
            const res = await ApiClient.post("/auth/verify-pin", {
              pin: enteredPin,
            });
            if (res.success) {
              onSuccess();
              this.executeSwitchToParent();
            } else {
              onError();
            }
          } catch (e) {
            onError();
          }
        });
      } else {
        this.executeSwitchToParent();
      }
    } catch (err) {
      console.error("Erreur lors du passage au mode parent :", err);
    }
  }

  executeSwitchToParent() {
    this.app.model.session.clearActiveChild();
    this.app.navigation.goTo("parent-home");
  }

  async submitChildRegistration() {
    const state = this.app.model.getAuthState();
    if (state.isLoading) return;

    this.app.model.setLoading(true);
    this.triggerRender();

    try {
      const payload = {
        name: state.childRegisterData.name,
        age: parseInt(state.childRegisterData.age) || null,
        instrument: state.childRegisterData.instrument,
        time_amount: parseInt(state.childRegisterData.time_amount) || null,
        school: state.childRegisterData.school,
        mascot: state.childRegisterData.mascot,
        days: state.childRegisterData.days,
      };

      const result = await ApiClient.post("/auth/register-child", payload);

      if (!result || result.error || !result.success) {
        throw new Error(result?.error || "Erreur création enfant");
      }

      this.app.model.session.setActiveChild(result.childId);

      this.app.model.setAuthStep(8);
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
    this.app.model.setAuthStep(1);
    this.app.navigation.goTo("login");
  }

  async triggerRender() {
    if (this.app.view.currentPage) {
      const content = await this.app.view.currentPage.render();
      this.app.view.appRoot.replaceChildren(content);
    }
  }
}
