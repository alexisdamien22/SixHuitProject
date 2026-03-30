import { db } from "../db/connection.js";

export class StreaksManager {
  static async update(childId, streak, lastDate) {
    const [result] = await db.query(
      `INSERT INTO streaks (child_id, current_streak, last_practice_date) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         current_streak = VALUES(current_streak), 
         last_practice_date = VALUES(last_practice_date)`,
      [childId, streak, lastDate],
    );
    return result;
  }

  static async get(childId) {
    const [rows] = await db.query("SELECT * FROM streaks WHERE child_id = ?", [
      childId,
    ]);
    return rows[0] || null;
  }
}
