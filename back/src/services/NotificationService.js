import cron from "node-cron";
import webpush from "web-push";
import { ChildAccountModel } from "../models/ChildAccountModel.js";

export class NotificationService {
    static init() {
        webpush.setVapidDetails(
            "mailto:support@sixhuit.fr",
            process.env.PUBLIC_VAPID_KEY,
            process.env.PRIVATE_VAPID_KEY,
        );

        cron.schedule("0 18-23 * * *", async () => {
            await this.checkAndRemindChildren();
        });
    }

    static async sendPush(childId, title, body, url = "/") {
        const sql =
            "SELECT subscription_json FROM push_subscriptions WHERE child_id = ?";
        const rows = await ChildAccountModel.query(sql, [childId]);

        for (const row of rows) {
            try {
                const subscription = JSON.parse(row.subscription_json);
                const payload = JSON.stringify({ title, body, url });
                await webpush.sendNotification(subscription, payload);
            } catch (error) {
                if (error.statusCode === 410) {
                    await ChildAccountModel.query(
                        "DELETE FROM push_subscriptions WHERE subscription_json = ?",
                        [row.subscription_json],
                    );
                }
            }
        }
    }

    static async checkAndRemindChildren() {
        const now = new Date();
        const hour = now.getHours();
        const hoursLeft = 24 - hour;

        const sql = `
            SELECT c.id, c.name 
            FROM childaccount c
            JOIN weekly_plan w ON c.id = w.child_id
            WHERE w.day_of_week = LOWER(DAYNAME(NOW()))
            AND w.practice = 1
            AND c.id NOT IN (
                SELECT child_id FROM sessions WHERE DATE(session_date) = CURDATE()
            )
        `;

        const childrenToRemind = await ChildAccountModel.query(sql);

        for (const child of childrenToRemind) {
            const title = "🚨 Rappel de pratique";
            const body = `Hé ${child.name}, il ne reste que ${hoursLeft}h pour valider ta leçon ce soir !`;
            await this.sendPush(child.id, title, body, "/");
        }
    }
}
