import { BaseModel } from "./BaseModel.js";

export class FollowingModel extends BaseModel {
    static follow(adultId, childId) {
        return this.query(
            "INSERT INTO following (adult_id, child_id) VALUES (?, ?)",
            [adultId, childId]
        );
    }

    static getFollowers(childId) {
        return this.query(
            "SELECT * FROM following WHERE child_id = ?",
            [childId]
        );
    }
}