import { db } from "../db/connection.js";

export class ChildAccountManager {
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM childaccount WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async create(data, adultId = null) {
    const age = data.age ? parseInt(data.age, 10) : null;
    const duree = data.duree ? parseInt(data.duree, 10) : null;

    const [result] = await db.query(
      "INSERT INTO childaccount (name, adultId, age, instrument, duree, ecole, mascotte) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        adultId,
        age,
        data.instrument || null,
        duree,
        data.ecole || null,
        data.mascotte || null,
      ],
    );
    return result.insertId;
  }

  static async getChildrenOfAdult(adultId) {
    const [rows] = await db.query(
      "SELECT * FROM childaccount WHERE adultId = ?",
      [adultId],
    );
    return rows;
  }
}
