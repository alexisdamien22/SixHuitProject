import { BaseModel } from "./BaseModel.js";

export class StreakModel extends BaseModel {
    static getStreak(childId) {
        return this.query(
            "SELECT * FROM streaks WHERE child_id = ?",
            [childId]
        );
    }

    static updateStreak(childId, value) {
        return this.query(
            `INSERT INTO streaks (child_id, value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value)`,
            [childId, value]
        );
    }
}
