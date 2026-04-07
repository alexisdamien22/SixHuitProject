import { ApiClient } from "../model/ApiClient.js";

export class SocialController {
    constructor(app) {
        this.app = app;
    }

    async getRecommendations() {
        const childId = localStorage.getItem("activeChildId");
        return ApiClient.get(`/social/recommendations?childId=${childId}`);
    }

    async search(query) {
        const childId = localStorage.getItem("activeChildId");
        return ApiClient.get(
            `/social/search?q=${encodeURIComponent(query)}&childId=${childId}`,
        );
    }

    async follow(followedId) {
        const followerId = localStorage.getItem("activeChildId");
        return ApiClient.post("/social/follow", { followerId, followedId });
    }

    async getFriends() {
        const childId = localStorage.getItem("activeChildId");
        return ApiClient.get(`/social/friends?childId=${childId}`);
    }
}
