import { AuthService } from "../services/AuthService.js";
import { ChildAccountModel } from "../models/AdultAccountModel.js";
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
      const adultId = req.user.id;
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
  static async getChildren(req, res) {
    try {
      const adultId = req.user.id;
      const children = await ChildAccountModel.findByAdultId(adultId);

      res.status(200).json({
        success: true,
        children: children,
      });
    } catch (err) {
      console.error("[AuthController Error]", err);
      res.status(500).json({ error: err.message });
    }
  }
}
