import { AuthService } from "../services/AuthService.js";

export class AuthController {
    static async register(req, res) {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
            res.status(200).json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async getProfile(req, res) {
        try {
            const result = await AuthService.getProfile(req.user.id);
            res.status(200).json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    }
}