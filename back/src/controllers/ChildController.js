import { ChildService } from "../services/ChildService.js";

export class ChildController {
    static async getChildData(req, res) {
        const childId = req.params.childId;
        const result = await ChildService.getChildData(childId);
        res.status(200).json(result);
    }

    static async updateSession(req, res) {
        const childId = req.params.childId;
        const result = await ChildService.updateSession(childId, req.body);
        res.status(200).json(result);
    }

    static async updateWeeklyPlan(req, res) {
        const childId = req.params.childId;
        const result = await ChildService.updateWeeklyPlan(childId, req.body);
        res.status(200).json(result);
    }

    static async updateStreak(req, res) {
        const childId = req.params.childId;
        const result = await ChildService.updateStreak(childId, req.body);
        res.status(200).json(result);
    }
}
