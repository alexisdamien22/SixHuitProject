import { BaseModel } from "./BaseModel.js";

export class WeeklyPlanModel extends BaseModel {
    static getPlan(childId) {
        return this.query(
            "SELECT day_of_week, practice, status FROM weekly_plan WHERE child_id = ?",
            [childId],
        );
    }

    static setDayStatus(childId, day_of_week, status) {
        return this.query(
            "UPDATE weekly_plan SET status = ? WHERE child_id = ? AND day_of_week = ?",
            [status, childId, day_of_week],
        );
    }

    static setDay(childId, day_of_week, practice) {
        return this.query(
            `INSERT INTO weekly_plan (child_id, day_of_week, practice, status)
                VALUES (?, ?, ?, 0)
                ON DUPLICATE KEY UPDATE practice = VALUES(practice)`,
            [childId, day_of_week, practice],
        );
    }
}
