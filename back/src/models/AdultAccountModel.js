import { BaseModel } from "./BaseModel.js";

export class AdultAccountModel extends BaseModel {
  static findByEmail(email) {
    return this.query("SELECT * FROM adultaccount WHERE email = ?", [email]);
  }

  static create({ email, password, teacher }) {
    return this.query(
      "INSERT INTO adultaccount (email, password_hash, teacher) VALUES (?, ?, ?)",
      [email, password, teacher],
    );
  }

  static findById(id) {
    return this.query(
      "SELECT id, email, teacher, created_at FROM adultaccount WHERE id = ?",
      [id],
    );
  }

  static getChildrenByAdultId(adultId) {
    return this.query("SELECT * FROM childaccount WHERE adultId = ?", [
      adultId,
    ]);
  }
}
