import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";
import { SessionsModel } from "../models/SessionsModel.js";
import { SocialModel } from "../models/SocialModel.js";

export class ChildService {
    static async getChildData(childId) {
        const child = await ChildAccountModel.findById(childId);
        if (!child || child.length === 0) {
            const error = new Error("Child not found");
            error.status = 404;
            throw error;
        }

        const [plan, streakData, sessions, friends] = await Promise.all([
            WeeklyPlanModel.getPlan(childId),
            StreakModel.getStreak(childId),
            SessionsModel.getSessions(childId),
            SocialModel.getFriends(childId),
        ]);

        let currentStreak = 0;
        if (streakData && streakData.length > 0) {
            currentStreak = streakData[0].current_streak;
        }

        return {
            ...child[0],
            weeklyPlan: plan,
            streak: currentStreak,
            sessions: sessions || [],
            friends: friends || [],
        };
    }

    static async updateSession(childId, data) {
        const happiness =
            data.happiness !== undefined ? Number(data.happiness) : 0;
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
        const childRows = await ChildAccountModel.findById(childId);

        if (!childRows || childRows.length === 0) return;
        const child = childRows[0];

        let currentStreak = 0;
        let lastDate = null;

        if (streakData && streakData.length > 0) {
            currentStreak = streakData[0].current_streak;
            if (streakData[0].last_practice_date) {
                const dateObj = new Date(streakData[0].last_practice_date);
                if (!isNaN(dateObj)) {
                    lastDate = dateObj.toISOString().split("T")[0];
                }
            }
        }

        const today = sessionDate;

        // Si l'enfant a déjà validé une séance aujourd'hui, on ne change rien
        if (lastDate === today) {
            return;
        }

        const yesterdayObj = new Date(today);
        yesterdayObj.setDate(yesterdayObj.getDate() - 1);
        const yesterday = yesterdayObj.toISOString().split("T")[0];

        // --- LOGIQUE DE PROTECTION (FREEZE) ---
        const now = new Date();
        const freezeUntil = child.freeze_until
            ? new Date(child.freeze_until)
            : null;
        const isFrozen = freezeUntil && freezeUntil >= now;

        if (lastDate === yesterday || lastDate === null) {
            // Cas normal : on incrémente
            currentStreak += 1;
        } else {
            // Cas de rupture de chaîne : on vérifie si c'était gelé
            if (isFrozen) {
                // Le gel protège la streak, on repart de l'ancienne valeur + 1 (pour la séance du jour)
                currentStreak += 1;
            } else {
                // Pas de gel : retour à 1
                currentStreak = 1;
            }
        }

        await StreakModel.updateStreak(childId, currentStreak, today);
    }

    static async updateWeeklyPlan(childId, data) {
        return { success: true };
    }

    static async updateStreak(childId, data) {
        return { success: true };
    }
    static async updateSettings(childId, settings) {
        let sql = "UPDATE childaccount SET ";
        const params = [];
        const updates = [];

        if (settings.is_public !== undefined) {
            updates.push("is_public = ?");
            params.push(settings.is_public ? 1 : 0);
        }
        if (settings.allow_friends !== undefined) {
            updates.push("allow_friends = ?");
            params.push(settings.allow_friends ? 1 : 0);
        }
        if (settings.freeze !== undefined) {
            updates.push("freeze_until = ?");
            // Si freeze est true, on met la date à J+7, sinon on vide (null)
            const date = settings.freeze
                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                : null;
            params.push(date);
        }

        if (updates.length === 0) return { success: true };

        sql += updates.join(", ") + " WHERE id = ?";
        params.push(childId);

        await ChildAccountModel.query(sql, params);
        return { success: true };
    }
}
