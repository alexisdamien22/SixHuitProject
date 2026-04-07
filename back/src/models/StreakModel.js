import { BaseModel } from "./BaseModel.js";

export class StreakModel extends BaseModel {
    static getStreak(childId) {
        return this.query(
            "SELECT current_streak, last_practice_date FROM streaks WHERE child_id = ?",
            [childId],
        );
    }

    static updateStreak(childId, current_streak, last_practice_date) {
        const date = last_practice_date ?? null;

        return this.query(
            `INSERT INTO streaks (child_id, current_streak, last_practice_date)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                current_streak = ?,
                last_practice_date = ?`,
            [childId, current_streak, date, current_streak, date],
        );
    }
}
