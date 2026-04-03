import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";
import { SessionsModel } from "../models/SessionsModel.js";

export class ChildService {
  static async getChildData(childId) {
    const child = await ChildAccountModel.findById(childId);
    if (!child || child.length === 0) {
      const error = new Error("Child not found");
      error.status = 404;
      throw error;
    }
    const plan = await WeeklyPlanModel.getPlan(childId);
    const streakData = await StreakModel.getStreak(childId);
    const sessions = await SessionsModel.getSessions(childId);

    return {
      ...child[0],
      weeklyPlan: plan,
      streak: streakData[0]?.current_streak || 0,
      sessions: sessions || [],
    };
  }

  static async updateSession(childId, data) {
    const happiness = data.happiness !== undefined ? Number(data.happiness) : 0;
    const quality = data.quality !== undefined ? Number(data.quality) : 0;
    const sessionDate =
      data.session_date || new Date().toISOString().slice(0, 10);

    await SessionsModel.addSession(childId, {
      session_date: sessionDate,
      happiness: happiness,
      quality: quality,
    });

    if (data.practice_day) {
      const mapDays = {
        Lundi: "monday",
        Mardi: "tuesday",
        Mercredi: "wednesday",
        Jeudi: "thursday",
        Vendredi: "friday",
        Samedi: "saturday",
        Dimanche: "sunday",
      };
      const englishDay = mapDays[data.practice_day];
      if (englishDay) {
        await WeeklyPlanModel.setDayStatus(childId, englishDay, 1);
      }
    }

    await this.calculateStreak(childId, sessionDate);

    return { success: true };
  }

  static async calculateStreak(childId, sessionDate) {
    const streakData = await StreakModel.getStreak(childId);
    let currentStreak = 0;
    let lastDate = null;

    if (streakData.length > 0) {
      currentStreak = streakData[0].current_streak;
      lastDate = streakData[0].last_practice_date
        ? new Date(streakData[0].last_practice_date).toISOString().slice(0, 10)
        : null;
    }

    const today = sessionDate;

    if (lastDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastDate === yesterdayStr || lastDate === null) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    await StreakModel.updateStreak(childId, currentStreak, today);
  }

  static async updateWeeklyPlan(childId, data) {
    return { success: true };
  }

  static async updateStreak(childId, data) {
    return { success: true };
  }
}
