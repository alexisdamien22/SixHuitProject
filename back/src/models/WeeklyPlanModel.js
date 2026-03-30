import { BaseModel } from "./BaseModel.js";

export class WeeklyPlanModel extends BaseModel {
    static getPlan(childId) {
        return this.query(
            "SELECT * FROM weekly_plan WHERE child_id = ?",
            [childId]
        );
    }

    static setDay(childId, day, status) {
        return this.query(
            `INSERT INTO weekly_plan (child_id, day, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
            [childId, day, status]
        );
    }
}
