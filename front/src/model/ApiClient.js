import { API_URL } from "../config/api.js";

function getHeaders() {
    const headers = { "Content-Type": "application/json" };
    const sessionRaw = localStorage.getItem("sixhuit-session");
    if (sessionRaw) {
        try {
            const session = JSON.parse(sessionRaw);
            if (session.token) {
                headers["Authorization"] = `Bearer ${session.token}`;
            }
        } catch (e) {
            console.error("Error parsing session", e);
        }
    }
    return headers;
}

export class ApiClient {
    static async request(path, method = "GET", data = null) {
        const options = {
            method,
            headers: getHeaders(),
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        let url = `${API_URL}${path}`;
        if (method === "GET") {
            const separator = path.includes("?") ? "&" : "?";
            url += `${separator}t=${Date.now()}`;
        }

        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        return res.json();
    }

    static async get(path) {
        return this.request(path, "GET");
    }

    static async post(path, data) {
        return this.request(path, "POST", data);
    }

    static async patch(path, data) {
        return this.request(path, "PATCH", data);
    }

    static async delete(path) {
        return this.request(path, "DELETE");
    }
}
