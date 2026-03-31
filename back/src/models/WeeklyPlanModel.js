import { BaseModel } from "./BaseModel.js";

export class WeeklyPlanModel extends BaseModel {
    static getPlan(childId) {
        return this.query(
            "SELECT day_of_week, practice FROM weekly_plan WHERE child_id = ?",
            [childId]
        );
    }

    static setDay(childId, day_of_week, practice) {
        return this.query(
            `INSERT INTO weekly_plan (child_id, day_of_week, practice)
             VALUES (?, ?, ?, )
             ON DUPLICATE KEY UPDATE practice = VALUES(practice)`,
            [childId, day_of_week, practice]
        );
    }
}
