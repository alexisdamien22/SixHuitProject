import { db } from "../db/connection.js";

export class AdultAccountManager {
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM adultaccount WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async create(username, teacher = false) {
    const [result] = await db.query(
      "INSERT INTO adultaccount (username, teacher) VALUES (?, ?)",
      [username, teacher],
    );
    return result.insertId;
  }
}
