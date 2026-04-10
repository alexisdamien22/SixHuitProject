import { BaseModel } from "./BaseModel.js";

export class SocialModel extends BaseModel {
    static searchChildren(query, currentChildId) {
        return this.query(
            `SELECT c.id, c.name, c.mascot, c.instrument
             FROM childaccount c 
             WHERE c.name ILIKE ? 
             AND c.id != ? 
             AND c.is_public = true 
             LIMIT 10`,
            [`%${query}%`, currentChildId],
        );
    }

    static async addFriend(followerId, followedId) {
        // INSERT IGNORE devient ON CONFLICT DO NOTHING
        return this.query(
            "INSERT INTO following (following_child_id, followed_child_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
            [followerId, followedId],
        );
    }

    static getRecommendations(childId) {
        const sql = `
            SELECT c.id, c.name, c.mascot, c.instrument, COUNT(*) as common_friends
            FROM following f1
            JOIN following f2 ON f1.followed_child_id = f2.following_child_id
            JOIN childaccount c ON f2.followed_child_id = c.id
            WHERE f1.following_child_id = ? 
              AND f2.followed_child_id != ?
              AND f2.followed_child_id NOT IN (
                  SELECT followed_child_id FROM following WHERE following_child_id = ?
              )
            GROUP BY c.id, c.name, c.mascot, c.instrument
            ORDER BY common_friends DESC
            LIMIT 5
        `;
        return this.query(sql, [childId, childId, childId]);
    }

    static getFriends(childId) {
        const sql = `
            SELECT c.id, c.name, c.mascot, c.instrument, COALESCE(s.current_streak, 0) as streak
            FROM following f
            JOIN childaccount c ON f.followed_child_id = c.id
            LEFT JOIN streaks s ON c.id = s.child_id
            WHERE f.following_child_id = ?
        `;
        return this.query(sql, [childId]);
    }
}
