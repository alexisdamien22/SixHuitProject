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
    static async request(path, options = {}) {
        // Ajout du timestamp pour briser le cache sur toutes les requêtes GET
        const separator = path.includes("?") ? "&" : "?";
        const url =
            options.method === "GET" || !options.method
                ? `${API_URL}${path}${separator}t=${Date.now()}`
                : `${API_URL}${path}`;

        const res = await fetch(url, {
            ...options,
            headers: getHeaders(),
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
