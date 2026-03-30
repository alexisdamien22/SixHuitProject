import { db } from "../db/connection.js";

export class WeeklyPlanManager {
  static async getPlan(childId) {
    const [rows] = await db.query(
      "SELECT * FROM weekly_plan WHERE child_id = ?",
      [childId],
    );
    return rows;
  }

  static async setDay(childId, day, practice, color) {
    const [result] = await db.query(
      `INSERT INTO weekly_plan (child_id, day_of_week, practice, color)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         practice = VALUES(practice),
         color = VALUES(color)`,
      [childId, day, practice, color],
    );
    return result;
  }
}
