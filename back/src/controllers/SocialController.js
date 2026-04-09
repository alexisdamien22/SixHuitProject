import { SocialModel } from "../models/SocialModel.js";
import { SocialService } from "../services/SocialService.js";

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
        res.status(200).json(result);
    }

    static async getNotifications(req, res) {
        const { childId } = req.params;
        const notifications =
            await SocialService.getPendingNotifications(childId);
        res.status(200).json(notifications);
    }
}
