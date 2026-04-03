import { ChildService } from "../services/ChildService.js";

export class ChildController {
  static async getChildData(req, res) {
    try {
      const childId = req.params.childId;
      const result = await ChildService.getChildData(childId);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async updateSession(req, res) {
    try {
      console.log("--- API HIT: updateSession ---");
      console.log("Params childId:", req.params.childId);
      console.log("Body received:", req.body);

      const childId = req.params.childId;
      const result = await ChildService.updateSession(childId, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Controller Error:", error);
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async updateWeeklyPlan(req, res) {
    try {
      const childId = req.params.childId;
      const result = await ChildService.updateWeeklyPlan(childId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async updateStreak(req, res) {
    try {
      const childId = req.params.childId;
      const result = await ChildService.updateStreak(childId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}
