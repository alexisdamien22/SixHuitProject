import { BaseModel } from "./BaseModel.js";

export class AdultAccountModel extends BaseModel {
  static findByUsername(username) {
    return this.query("SELECT * FROM adultaccount WHERE username = ?", [
      username,
    ]);
  }

  static create({ username, password, teacher }) {
    return this.query(
      "INSERT INTO adultaccount (username, password, teacher) VALUES (?, ?, ?)",
      [username, password, teacher],
    );
  }

  static findById(id) {
    return this.query(
      "SELECT id, username, teacher, created_at FROM adultaccount WHERE id = ?",
      [id] || null,
    );
  }
}
