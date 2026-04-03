import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AdultAccountModel } from "../models/AdultAccountModel.js";
import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";

export class AuthService {
    static async registerAdult(data) {
        const { email, password, teacher } = data;

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
            pin: data.pin,
        });

        const adultId = adult.insertId;

        const token = jwt.sign({ id: adultId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return {
            message: "Compte adulte créé avec succès",
            token,
            adultId,
        };
    }

    static async registerChild(adultId, data) {
        const child = await ChildAccountModel.create({
            adultId,
            name: data.name,
            age: data.age,
            instrument: data.instrument,
            time_amount: data.time_amount,
            school: data.school,
            mascot: data.mascot,
        });

        const childId = child.insertId;

        const days = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche",
        ];

        const mapDays = {
            Lundi: "monday",
            Mardi: "tuesday",
            Mercredi: "wednesday",
            Jeudi: "thursday",
            Vendredi: "friday",
            Samedi: "saturday",
            Dimanche: "sunday",
        };

        for (const day of days) {
            const english = mapDays[day];
            const status = data.days.includes(day) ? 1 : 0;
            await WeeklyPlanModel.setDay(childId, english, status);
        }

        await StreakModel.updateStreak(childId, 0);

        return {
            message: "Enfant créé avec succès",
            success: true,
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

        const valid = await bcrypt.compare(password, account.password_hash);
        if (!valid) {
            const err = new Error("Mot de passe incorrect.");
            err.status = 401;
            throw err;
        }

        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

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
