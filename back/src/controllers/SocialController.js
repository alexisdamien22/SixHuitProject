import { SocialModel } from "../models/SocialModel.js";

export class SocialController {
    static async search(req, res) {
        try {
            const { q, childId } = req.query;
            const results = await SocialModel.searchChildren(q, childId);
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async follow(req, res) {
        try {
            const { followerId, followedId } = req.body;
            await SocialModel.addFriend(followerId, followedId);
            res.status(201).json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getRecommendations(req, res) {
        try {
            const { childId } = req.query;
            const recommendations =
                await SocialModel.getRecommendations(childId);
            res.status(200).json(recommendations);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
