import { ApiClient } from "../model/ApiClient.js";

export class ChildController {
  constructor(app) {
    this.app = app;
  }

  async loadChildData() {
    try {
      // Récupère l'ID via la session ou via le localStorage (utilisé par le Switcher)
      const childId =
        this.app.model.session.getChildId() ||
        localStorage.getItem("activeChildId");

      if (!childId) {
        console.warn("Aucun childId trouvé dans la session");
        return;
      }

      console.log("Chargement des données enfant…", childId);

      const data = await ApiClient.get(`/child/${childId}`);

      if (data && data.error) {
        throw new Error(data.error);
      }

      console.log("Données enfant reçues :", data);

      this.app.model.setChildData(data);

      this.app.view.updateChildData(data);
    } catch (err) {
      console.error("Erreur lors du chargement des données enfant :", err);
    }
  }

  async updateSession(day, status) {
    try {
      const childId =
        this.app.model.session.getChildId() ||
        localStorage.getItem("activeChildId");

      await ApiClient.post(`/child/${childId}/session`, {
        day,
        status,
      });

      await this.loadChildData();
    } catch (err) {
      console.error("Erreur updateSession :", err);
    }
  }

  async updateStreak(value) {
    try {
      const childId =
        this.app.model.session.getChildId() ||
        localStorage.getItem("activeChildId");

      await ApiClient.post(`/child/${childId}/streak`, { value });

      await this.loadChildData();
    } catch (err) {
      console.error("Erreur updateStreak :", err);
    }
  }
}
