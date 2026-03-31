import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdultAccountModel } from "../models/AdultAccountModel.js";
import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";

export class AuthService {
    static async register(data) {
        const { email, password, teacher, child } = data;

        const existing = await AdultAccountModel.findByEmail(email);
        if (existing.length > 0) {
            const err = new Error("Cet utilisateur existe déjà.");
            err.status = 409;
            throw err;
        }

        const hashed = await bcrypt.hash(password, 10);

        const adult = await AdultAccountModel.create({
            email,
            password: hashed,
            teacher: teacher ? 1 : 0,
        });

        const adultId = adult.insertId;

        const childResult = await ChildAccountModel.create({
            adultId,
            ...child,
        });

        const childId = childResult.insertId;

        await WeeklyPlanModel.setDay(childId, "Lundi", "todo");
        await WeeklyPlanModel.setDay(childId, "Mardi", "todo");
        await WeeklyPlanModel.setDay(childId, "Mercredi", "todo");
        await WeeklyPlanModel.setDay(childId, "Jeudi", "todo");
        await WeeklyPlanModel.setDay(childId, "Vendredi", "todo");

        await StreakModel.updateStreak(childId, 0);

        const token = jwt.sign(
            { id: adultId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            message: "Compte créé avec succès",
            token,
            adultId,
            childId,
        };
    }

    static async login({ email, password }) {
        const user = await AdultAccountModel.findByEmail(email);

        if (user.length === 0) {
            const err = new Error("Utilisateur introuvable.");
            err.status = 404;
            throw err;
        }

        const account = user[0];

        const valid = await bcrypt.compare(password, account.password);
        if (!valid) {
            const err = new Error("Mot de passe incorrect.");
            err.status = 401;
            throw err;
        }

        const token = jwt.sign(
            { id: account.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            message: "Connexion réussie",
            token,
            adultId: account.id,
        };
    }

    static async getProfile(adultId) {
        const user = await AdultAccountModel.findById(adultId);
        if (user.length === 0) {
            const err = new Error("Profil introuvable.");
            err.status = 404;
            throw err;
        }

        return user[0];
    }
}
