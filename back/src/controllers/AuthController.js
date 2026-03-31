import { AuthService } from "../services/AuthService.js";

export class AuthController {
    static async registerAdult(req, res) {
        try {
            const result = await AuthService.registerAdult(req.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async registerChild(req, res) {
        try {
            const adultId = req.user.id; // récupéré via middleware JWT
            const result = await AuthService.registerChild(adultId, req.body);
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