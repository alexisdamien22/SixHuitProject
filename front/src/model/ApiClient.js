import { API_URL } from "../config/api.js";

export class ApiClient {
    static token = null;

    static setToken(token) {
        this.token = token;
    }

    static async request(path, options = {}) {
        const separator = path.includes("?") ? "&" : "?";
        const url =
            options.method === "GET" || !options.method
                ? `${API_URL}${path}${separator}t=${Date.now()}`
                : `${API_URL}${path}`;

        const headers = { "Content-Type": "application/json" };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        const res = await fetch(url, {
            ...options,
            headers,
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${res.status}`);
        }

        return res.json();
    }

    static async get(path) {
        return this.request(path, { method: "GET" });
    }

    static async post(path, data) {
        return this.request(path, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    static async patch(path, data) {
        return this.request(path, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    static async delete(path) {
        return this.request(path, { method: "DELETE" });
    }
}
