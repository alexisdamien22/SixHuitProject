import { db } from "../db/connection.js";

export class AuditLogManager {
  static async log(childId, actionType, details = null) {
    await db.query(
      "INSERT INTO auditlog (child_id, action_type, action_details) VALUES (?, ?, ?)",
      [childId, actionType, details],
    );
  }

  static async getLogs(childId) {
    const [rows] = await db.query(
      "SELECT * FROM auditlog WHERE child_id = ? ORDER BY created_at DESC",
      [childId],
    );
    return rows;
  }
}
