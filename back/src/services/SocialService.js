import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { NotificationService } from "./NotificationService.js";
import { SessionsModel } from "../models/SessionsModel.js";
import { SocialModel } from "../models/SocialModel.js";

export class SocialService {
    static async sendInteraction(senderId, receiverId) {
        const hasSession = await SessionsModel.hasSessionToday(receiverId);
        const type = hasSession ? "congrats" : "remind";

        await SocialModel.recordInteraction(senderId, receiverId, type);

        const senderRows = await ChildAccountModel.findById(senderId);
        const senderName = senderRows[0]?.name || "Un ami";

        let title = "";
        let body = "";

        if (type === "congrats") {
            title = "Bravo ! 🎉";
            body = `${senderName} t'a félicité pour ton travail !`;
        } else {
            title = "Petit rappel 🔔";
            body = `${senderName} te rappelle de faire ta leçon !`;
        }

        NotificationService.sendPush(
            receiverId,
            title,
            body,
            "/community",
        ).catch((err) =>
            console.error(
                "[SocialService] Erreur envoi Push interaction:",
                err,
            ),
        );

        return { success: true, type };
    }

    static async getPendingNotifications(childId) {
        const sqlSelect = `
            SELECT i.id, i.type, c.name as senderName 
            FROM interactions i
            JOIN childaccount c ON i.sender_id = c.id
            WHERE i.receiver_id = ? AND i.is_read = 0
        `;
        const notifications = await ChildAccountModel.query(sqlSelect, [
            childId,
        ]);

        if (notifications.length > 0) {
            const sqlUpdate =
                "UPDATE interactions SET is_read = 1 WHERE receiver_id = ? AND is_read = 0";
            await ChildAccountModel.query(sqlUpdate, [childId]);
        }

        return notifications;
    }
}
