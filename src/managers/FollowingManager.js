import { db } from "../db/connection.js";

export class FollowingManager {
  static async follow(followerId, followedId) {
    await db.query(
      "INSERT IGNORE INTO following (following_child_id, followed_child_id) VALUES (?, ?)",
      [followerId, followedId],
    );
  }

  static async unfollow(followerId, followedId) {
    await db.query(
      "DELETE FROM following WHERE following_child_id = ? AND followed_child_id = ?",
      [followerId, followedId],
    );
  }

  static async getFollowers(childId) {
    const [rows] = await db.query(
      `SELECT c.* FROM following f
       JOIN childaccount c ON c.id = f.following_child_id
       WHERE f.followed_child_id = ?`,
      [childId],
    );
    return rows;
  }
}
