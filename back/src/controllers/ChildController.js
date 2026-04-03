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

    static async updateSession(req, res) {
        try {
            const childId = req.params.childId;
            const result = await ChildService.updateSession(childId, req.body);
            res.status(200).json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
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
