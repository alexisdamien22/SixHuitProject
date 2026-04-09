import { ApiClient } from "../model/ApiClient.js";

export class SocialController {
    constructor(app) {
        this.app = app;
    }

    async getRecommendations() {
        const childId = this.app.model.session.getChildId();
        return ApiClient.get(`/social/${childId}/recommendations`);
    }

    async search(query) {
        const childId = this.app.model.session.getChildId();
        return ApiClient.get(
            `/social/${childId}/search?q=${encodeURIComponent(query)}`,
        );
    }

    async follow(followedId) {
        const childId = this.app.model.session.getChildId();
        return ApiClient.post(`/social/${childId}/follow`, { followedId });
    }

    async getFriends() {
        const childId = this.app.model.session.getChildId();
        return ApiClient.get(`/social/${childId}/friends`);
    }

    async interact(targetId) {
        const childId = this.app.model.session.getChildId();
        return ApiClient.post(`/social/${childId}/interact/${targetId}`);
    }
}
