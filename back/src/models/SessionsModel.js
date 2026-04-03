import { BaseModel } from "./BaseModel.js";

export class SessionsModel extends BaseModel {
    static addSession(childId, data) {
        return this.query(
            "INSERT INTO sessions (child_id, session_date, happiness, quality) VALUES (?, ?, ?, ?)",
            [childId, data.session_date, data.happiness, data.quality],
        );
    }

    static getSessions(childId) {
        return this.query(
            "SELECT * FROM sessions WHERE child_id = ? ORDER BY session_date DESC",
            [childId],
        );
    }
}
