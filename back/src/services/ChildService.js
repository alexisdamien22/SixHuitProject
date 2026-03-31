import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";

export class ChildService {
    static async getChildData(childId) {
        const child = await ChildAccountModel.findById(childId);
        if (child.length === 0) throw new Error("Enfant introuvable.");

        const plan = await WeeklyPlanModel.getPlan(childId);
        const streak = await StreakModel.getStreak(childId);
        const sessions = await SessionsModel.getSessions(childId);

        return {
            ...child[0],
            weeklyPlan: plan,
            streak: streak[0] || { current_streak: 0, last_practice_date: null },
            sessions
        };
    }

    static async updateSession(childId, data) {
        await SessionsModel.addSession(childId, data);
        return { message: "Session enregistrée" };
    }
}
