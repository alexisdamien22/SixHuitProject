import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { AdultAccountModel } from "../models/AdultAccountModel.js";
import { ChildAccountModel } from "../models/ChildAccountModel.js";
import { WeeklyPlanModel } from "../models/WeeklyPlanModel.js";
import { StreakModel } from "../models/StreakModel.js";

export class AuthService {
    static async registerAdult(data) {
        const { email, password, teacher, pin } = data;

        const existing = await AdultAccountModel.findByEmail(email);
        if (existing.length > 0) {
            const err = new Error("Cet utilisateur existe déjà.");
            err.status = 409;
            throw err;
        }

        const hashed = await bcrypt.hash(password, 10);
        let hashedPin = null;
        if (pin) {
            hashedPin = await bcrypt.hash(String(pin), 10);
        }

        const adult = await AdultAccountModel.create({
            email,
            password: hashed,
            teacher: teacher ? 1 : 0,
            pin: hashedPin,
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

    static async getProfile(adultId) {
        const user = await AdultAccountModel.findById(adultId);
        if (user.length === 0) {
            const err = new Error("Profil introuvable.");
            err.status = 404;
            throw err;
        }

        const profile = user[0];
        const hasPin = !!profile.pin;
        delete profile.pin;

        return { ...profile, hasPin };
    }

    static async verifyPin(adultId, pin) {
        const rows = await AdultAccountModel.query(
            "SELECT pin FROM adultaccount WHERE id = ?",
            [adultId],
        );

        if (rows.length === 0) {
            throw { status: 404, message: "Utilisateur introuvable." };
        }

        const hashedPin = rows[0].pin;
        if (!hashedPin) {
            throw { status: 400, message: "Aucun PIN configuré." };
        }

        const valid = await bcrypt.compare(String(pin), hashedPin);
        if (!valid) {
            throw { status: 401, message: "Code PIN incorrect." };
        }

        return { success: true };
    }

    static async updatePin(adultId, newPin) {
        if (!newPin || String(newPin).length !== 4) {
            throw {
                status: 400,
                message: "Le code PIN doit faire 4 chiffres.",
            };
        }

        const hashedPin = await bcrypt.hash(String(newPin), 10);
        await AdultAccountModel.updatePin(adultId, hashedPin);

        return { success: true, message: "Code PIN mis à jour." };
    }

    static async forgotPassword(email) {
        if (!email) {
            throw { status: 400, message: "L'adresse email est requise." };
        }

        const user = await AdultAccountModel.findByEmail(email);

        if (user.length > 0) {
            const token = crypto.randomBytes(32).toString("hex");

            // Expire dans 1 heure (format MySQL DATETIME)
            const expires = new Date(Date.now() + 3600000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

            await AdultAccountModel.saveResetToken(email, token, expires);

            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/?resetToken=${token}`;

            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail", // Si vous utilisez un autre fournisseur, remplacez par host/port
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"L'équipe SixHuit" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: "Réinitialisation de votre mot de passe",
                    html: `
                        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                            <h2>Réinitialisation de mot de passe</h2>
                            <p>Vous avez demandé à réinitialiser votre mot de passe sur SixHuit.</p>
                            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #6c5ce7; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Créer un nouveau mot de passe
                            </a>
                            <p style="color: #888; font-size: 12px;">Ce lien expire dans 1 heure.</p>
                            <p style="color: #888; font-size: 12px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
                        </div>
                    `,
                });
                console.log(
                    `[Email] Lien de réinitialisation envoyé à ${email}`,
                );
            } catch (err) {
                console.error("[Erreur d'envoi d'email] :", err);
            }
        }

        // On renvoie un succès générique pour ne pas divulguer si l'email existe ou non (Sécurité)
        return {
            success: true,
            message: "Si l'email existe, un lien a été envoyé.",
        };
    }

    static async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw {
                status: 400,
                message: "Token et nouveau mot de passe requis.",
            };
        }

        const user = await AdultAccountModel.findByResetToken(token);
        if (user.length === 0) {
            throw {
                status: 400,
                message: "Lien de réinitialisation invalide ou expiré.",
            };
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await AdultAccountModel.updatePassword(user[0].id, hashed);
        return {
            success: true,
            message: "Mot de passe réinitialisé avec succès.",
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
            lesson_day: data.lesson_day,
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
        return { message: "Enfant créé avec succès", success: true, childId };
    }

    static async login({ email, password }) {
        const user = await AdultAccountModel.findByEmail(email);
        if (user.length === 0)
            throw { status: 404, message: "Utilisateur introuvable." };

        const account = user[0];
        const valid = await bcrypt.compare(password, account.password_hash);
        if (!valid) throw { status: 401, message: "Mot de passe incorrect." };

        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return { message: "Connexion réussie", token, adultId: account.id };
    }
}
