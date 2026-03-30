import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";

export class ChildService {
    static async getChildData(childId) {
        const child = await ChildAccountModel.findById(childId);
        if (child.length === 0) {
            const err = new Error("Enfant introuvable.");
            err.status = 404;
            throw err;
        }

        const plan = await WeeklyPlanModel.getPlan(childId);
        const streak = await StreakModel.getStreak(childId);

        return {
            ...child[0],
            weeklyPlan: plan,
            streak: streak[0]?.value || 0,
        };
    }

    static async updateSession(childId, data) {
        await WeeklyPlanModel.setDay(childId, data.day, data.status);

        return { message: "Session mise à jour" };
    }

    static async updateWeeklyPlan(childId, plan) {
        for (const day of Object.keys(plan)) {
            await WeeklyPlanModel.setDay(childId, day, plan[day]);
        }

        return { message: "Weekly plan mis à jour" };
    }

    static async updateStreak(childId, { value }) {
        await StreakModel.updateStreak(childId, value);

        return { message: "Streak mis à jour" };
    }
}
