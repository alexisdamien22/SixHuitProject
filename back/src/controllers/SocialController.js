import { SocialModel } from "../models/SocialModel.js";
import { SocialService } from "../services/SocialService.js";
import { NotificationService } from "../services/NotificationService.js";

export class SocialController {
    static async search(req, res) {
        const childId = req.params.childId;
        const { q } = req.query;
        const results = await SocialModel.searchChildren(q, childId);
        res.status(200).json(results);
    }

    static async follow(req, res) {
        const followerId = req.params.childId;
        const { followedId } = req.body;
        await SocialModel.addFriend(followerId, followedId);
        res.status(201).json({ success: true });
    }

    static async getRecommendations(req, res) {
        const childId = req.params.childId;
        const recommendations = await SocialModel.getRecommendations(childId);
        res.status(200).json(recommendations);
    }

    static async getFriends(req, res) {
        const childId = req.params.childId;
        const friends = await SocialModel.getFriends(childId);
        res.status(200).json(friends);
    }

    static async interact(req, res) {
        const { childId, targetId } = req.params;
        const result = await SocialService.sendInteraction(childId, targetId);

        const sender = await SocialModel.query(
            "SELECT name FROM childaccount WHERE id = ?",
            [childId],
        );
        const senderName = sender[0]?.name || "Un ami";

        const title =
            result.type === "congrats"
                ? "Félicitations ! 🎉"
                : "Petit rappel 🔔";
        const body =
            result.type === "congrats"
                ? `${senderName} t'a félicité pour ton travail !`
                : `${senderName} te rappelle de faire ta série !`;

        await NotificationService.sendPush(targetId, title, body, "/community");

        res.status(200).json(result);
    }

    static async getNotifications(req, res) {
        const { childId } = req.params;
        const notifications =
            await SocialService.getPendingNotifications(childId);
        res.status(200).json(notifications);
    }

    static async subscribePush(req, res) {
        const { childId } = req.params;
        const subscription = req.body;

        await SocialModel.query(
            "INSERT INTO push_subscriptions (child_id, subscription_json) VALUES (?, ?)",
            [childId, JSON.stringify(subscription)],
        );

        res.status(201).json({ success: true });
    }
}
