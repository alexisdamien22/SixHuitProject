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

async function handleResponse(res) {
    if (res.status === 401) {
        localStorage.removeItem("sixhuit-session");
        localStorage.removeItem("activeChildId");

        window.location.reload();

        throw new Error("Session expirée ou non autorisée.");
    }

    return res.json();
}

export class ApiClient {
    static async get(path) {
        const res = await fetch(`${API_URL}${path}`, {
            method: "GET",
            headers: getHeaders(),
        });
        return handleResponse(res);
    }

    static async post(path, data) {
        const res = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    }
}
