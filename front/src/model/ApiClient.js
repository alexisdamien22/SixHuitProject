import { API_URL } from "../config/api.js";

export class ApiClient {
    static async get(path) {
        const res = await fetch(`${API_URL}${path}`);
        return res.json();
    }

    static async post(path, data) {
        const res = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return res.json();
    }
}