import { BaseModel } from "./BaseModel.js";

export class SocialModel extends BaseModel {
    static searchChildren(query, currentChildId) {
        return this.query(
            `SELECT c.id, c.name, c.mascot, c.instrument
          FROM childaccount c 
          WHERE c.name LIKE ? 
          AND c.id != ? 
          AND c.is_public = 1 
          LIMIT 10`,
            [`%${query}%`, currentChildId],
        );
    }

    static async addFriend(followerId, followedId) {
        const sql =
            "INSERT IGNORE INTO following (following_child_id, followed_child_id) VALUES (?, ?)";

        return Promise.all([
            this.query(sql, [followerId, followedId]),
            this.query(sql, [followedId, followerId]),
        ]);
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
            GROUP BY c.id
            ORDER BY common_friends DESC
            LIMIT 5
        `;
        return this.query(sql, [childId, childId, childId]);
    }

    static getFriends(childId) {
        const sql = `
            SELECT c.id, c.name, c.mascot, c.instrument, IFNULL(s.current_streak, 0) as streak
            FROM following f
            JOIN childaccount c ON f.followed_child_id = c.id
            LEFT JOIN streaks s ON c.id = s.child_id
            WHERE f.following_child_id = ?
        `;
        return this.query(sql, [childId]);
    }

    static async recordInteraction(senderId, receiverId, type) {
        return this.query(
            "INSERT INTO interactions (sender_id, receiver_id, type, is_read) VALUES (?, ?, ?, 0)",
            [senderId, receiverId, type],
        );
    }
}
