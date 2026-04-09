import { ApiClient } from "../model/ApiClient.js";

export class ChildController {
    constructor(app) {
        this.app = app;
    }

    async loadChildData() {
        try {
            const childId =
                this.app.model.session.getChildId() ||
                localStorage.getItem("activeChildId");
            if (!childId) return;
            const data = await ApiClient.get(`/child/${childId}`);
            if (data && data.error) throw new Error(data.error);
            this.app.model.setChildData(data);
            this.app.view.updateChildData(data);
        } catch (err) {
            console.error("Error loading child data:", err);
        }
    }

    async getChildById(childId) {
        try {
            const data = await ApiClient.get(`/child/${childId}`);
            if (data && data.error) throw new Error(data.error);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async updateSession(sessionData) {
        try {
            const childId =
                this.app.model.session.getChildId() ||
                localStorage.getItem("activeChildId");
            if (!childId) throw new Error("No active child ID");

            await ApiClient.post(`/child/${childId}/session`, sessionData);
            await this.loadChildData();
        } catch (err) {
            console.error("Error updating session:", err);
            throw err;
        }
    }

    async updateStreak(value) {
        try {
            const childId =
                this.app.model.session.getChildId() ||
                localStorage.getItem("activeChildId");
            await ApiClient.post(`/child/${childId}/streak`, { value });
            await this.loadChildData();
        } catch (err) {
            console.error("Error updating streak:", err);
        }
    }

    async updateSettings(childId, settings) {
        try {
            await ApiClient.patch(`/child/${childId}/settings`, settings);
            return { success: true };
        } catch (err) {
            throw err;
        }
    }

    async deleteChild(childId) {
        try {
            await ApiClient.delete(`/child/${childId}`);
            return { success: true };
        } catch (err) {
            throw err;
        }
    }
}
