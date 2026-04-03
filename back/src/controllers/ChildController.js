import { ChildService } from "../services/ChildService.js";

export class ChildController {
  static async getChildData(req, res) {
    try {
      const childId = req.params.childId;
      const result = await ChildService.getChildData(childId);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  async updateSession(sessionData) {
    try {
      const childId =
        this.app.model.session.getChildId() ||
        localStorage.getItem("activeChildId");
      await ApiClient.post(`/child/${childId}/session`, sessionData);

      await this.loadChildData();
      this.app.navigation.goTo("home");
    } catch (err) {
      console.error("Erreur updateSession :", err);
    }
  }

  static async updateWeeklyPlan(req, res) {
    try {
      const childId = req.params.childId;
      const result = await ChildService.updateWeeklyPlan(childId, req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  static async updateStreak(req, res) {
    try {
      const childId = req.params.childId;
      const result = await ChildService.updateStreak(childId, req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }
}
