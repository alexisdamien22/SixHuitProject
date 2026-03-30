import { db } from "../db/connection.js";

export class SessionsManager {
  static async create(childId, date, happiness, quality, practiceDay) {
    const [result] = await db.query(
      `INSERT INTO sessions (child_id, session_date, hapiness, quality, practice_day)
       VALUES (?, ?, ?, ?, ?)`,
      [childId, date, happiness, quality, practiceDay],
    );
    return result.insertId;
  }

  static async getByChildId(childId) {
    const [rows] = await db.query(
      "SELECT * FROM sessions WHERE child_id = ? ORDER BY session_date DESC",
      [childId],
    );
    return rows;
  }
}
