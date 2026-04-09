import { ChildAccountModel } from "../models/ChildAccountModel.js";

export class SocialService {
    static async sendInteraction(senderId, receiverId) {
        const sqlCheck = `
            SELECT COUNT(*) as count 
            FROM sessions 
            WHERE child_id = ? AND DATE(session_date) = CURDATE()
        `;
        const rows = await ChildAccountModel.query(sqlCheck, [receiverId]);
        const type = rows[0].count > 0 ? "congrats" : "remind";

        const sqlInsert = `
            INSERT INTO interactions (sender_id, receiver_id, type, is_read) 
            VALUES (?, ?, ?, 0)
        `;
        await ChildAccountModel.query(sqlInsert, [senderId, receiverId, type]);

        return { success: true, type };
    }

    static async getPendingNotifications(childId) {
        const sql = `
            SELECT i.id, i.type, c.name as senderName 
            FROM interactions i
            JOIN childaccount c ON i.sender_id = c.id
            WHERE i.receiver_id = ? AND i.is_read = 0
        `;
        const notifications = await ChildAccountModel.query(sql, [childId]);

        if (notifications && notifications.length > 0) {
            // On marque comme lu TOUTES les notifications de cet utilisateur
            await ChildAccountModel.query(
                "UPDATE interactions SET is_read = 1 WHERE receiver_id = ? AND is_read = 0",
                [childId],
            );
        }

        return notifications;
    }
}
