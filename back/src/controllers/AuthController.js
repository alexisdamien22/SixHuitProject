import { AuthService } from "../services/AuthService.js";
import { ChildAccountModel } from "../models/ChildAccountModel.js";

export class AuthController {
    static async registerAdult(req, res) {
        const result = await AuthService.registerAdult(req.body);
        res.status(201).json(result);
    }

    static async registerChild(req, res) {
        const adultId = req.user.id;
        const result = await AuthService.registerChild(adultId, req.body);
        res.status(201).json(result);
    }

    static async login(req, res) {
        const result = await AuthService.login(req.body);
        res.status(200).json(result);
    }

    static async forgotPassword(req, res) {
        const { email } = req.body;
        const result = await AuthService.forgotPassword(email);
        res.status(200).json(result);
    }

    static async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        const result = await AuthService.resetPassword(token, newPassword);
        res.status(200).json(result);
    }

    static async getProfile(req, res) {
        const result = await AuthService.getProfile(req.user.id);
        res.status(200).json(result);
    }

    static async getChildren(req, res) {
        const adultId = req.user.id;
        const children = await ChildAccountModel.findByAdultId(adultId);
        res.status(200).json({ success: true, children });
    }

    static async verifyPin(req, res) {
        const adultId = req.user.id;
        const { pin } = req.body;
        const result = await AuthService.verifyPin(adultId, pin);
        res.status(200).json(result);
    }

    static async updatePin(req, res) {
        const adultId = req.user.id;
        const { newPin } = req.body;
        const result = await AuthService.updatePin(adultId, newPin);
        res.status(200).json(result);
    }

    static async verifyPassword(req, res) {
        const adultId = req.user.id;
        const { password } = req.body;
        const result = await AuthService.verifyPassword(adultId, password);
        res.status(200).json(result);
    }
}
