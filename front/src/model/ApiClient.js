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
  static async get(path) {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${API_URL}${path}${separator}t=${Date.now()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return res.json();
  }

  static async post(path, data) {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }
}
