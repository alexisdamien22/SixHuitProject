import { BaseModel } from "./BaseModel.js";

export class StreakModel extends BaseModel {
    static async getStreak(childId) {
        const rows = await this.query(
            "SELECT current_streak, last_practice_date FROM streaks WHERE child_id = ?",
            [childId],
        );
        return rows[0];
    }

    static updateStreak(childId, current_streak, last_practice_date) {
        const date = last_practice_date ?? null;

        // Syntaxe ON CONFLICT pour Postgres
        return this.query(
            `INSERT INTO streaks (child_id, current_streak, last_practice_date)
             VALUES (?, ?, ?)
             ON CONFLICT (child_id) DO UPDATE SET 
                current_streak = EXCLUDED.current_streak,
                last_practice_date = EXCLUDED.last_practice_date`,
            [childId, current_streak, date],
        );
    }
}
