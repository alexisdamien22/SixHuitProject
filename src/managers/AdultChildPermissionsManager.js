import { db } from "../db/connection.js";

export class AdultChildPermissionsManager {
  static async getPermissions(adultId, childId) {
    const [rows] = await db.query(
      "SELECT * FROM adultchildpermissions WHERE adult_id = ? AND child_id = ?",
      [adultId, childId],
    );
    return rows[0] || null;
  }

  static async setPermissions(adultId, childId, perms = {}) {
    const canView = perms.can_view || 0;
    const canEdit = perms.can_edit || 0;
    const canViewSessions = perms.can_view_sessions || 0;
    const canEditWeeklyPlan = perms.can_edit_weekly_plan || 0;

    await db.query(
      `INSERT INTO adultchildpermissions (adult_id, child_id, can_view, can_edit, can_view_sessions, can_edit_weekly_plan)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         can_view = VALUES(can_view),
         can_edit = VALUES(can_edit),
         can_view_sessions = VALUES(can_view_sessions),
         can_edit_weekly_plan = VALUES(can_edit_weekly_plan)`,
      [adultId, childId, canView, canEdit, canViewSessions, canEditWeeklyPlan],
    );
  }
}
