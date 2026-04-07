import { ApiClient } from "../model/ApiClient.js";

export class SocialController {
    constructor(app) {
        this.app = app;
    }

    async getRecommendations() {
        const childId = localStorage.getItem("activeChildId");
        return ApiClient.get(`/social/${childId}/recommendations`);
    }

    async search(query) {
        const childId = localStorage.getItem("activeChildId");
        return ApiClient.get(`/social/${childId}/search?q=${query}`);
    }

    async follow(followedId) {
        const followerId = localStorage.getItem("activeChildId");
        return ApiClient.post(`/social/${followerId}/follow`, { followedId });
    }
}
