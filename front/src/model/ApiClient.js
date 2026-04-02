// --- front/src/model/ApiClient.js ---
import { API_URL } from "../config/api.js";

export class ApiClient {
  static getHeaders() {
    const sessionRaw = localStorage.getItem("sixhuit-session");
    const token = sessionRaw ? JSON.parse(sessionRaw).token : null;

    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  static async get(path) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: this.getHeaders(),
    });
    return res.json();
  }

  static async post(path, data) {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }
}
