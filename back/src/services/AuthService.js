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

        // CORRECTION: existing est maintenant un objet ou undefined
        if (existing) {
            const err = new Error("User already exists");
            err.status = 409;
            throw err;
        }

        const hashed = await bcrypt.hash(password, 10);
        let hashedPin = null;
        if (pin) {
            hashedPin = await bcrypt.hash(String(pin), 10);
        }

        const result = await AdultAccountModel.create({
            email,
            password: hashed,
            teacher: teacher ? true : false, // Postgres utilise des booléens
            pin: hashedPin,
        });

        // CORRECTION: Postgres ne renvoie pas 'insertId', on récupère l'id du résultat
        const adultId = result[0].id;

        const token = jwt.sign({ id: adultId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return { message: "Account created successfully", token, adultId };
    }

    static async getProfile(adultId) {
        const profile = await AdultAccountModel.findById(adultId);

        // CORRECTION: profile est déjà l'objet (rows[0])
        if (!profile) {
            const err = new Error("Profile not found");
            err.status = 404;
            throw err;
        }

        const hasPin = !!profile.pin;
        delete profile.pin;
        return { ...profile, hasPin };
    }

    static async verifyPin(adultId, pin) {
        // CORRECTION: findById renvoie déjà l'objet
        const user = await AdultAccountModel.findById(adultId);

        if (!user) throw { status: 404, message: "User not found" };

        const hashedPin = user.pin;
        if (!hashedPin) throw { status: 400, message: "No PIN configured" };

        const valid = await bcrypt.compare(String(pin), hashedPin);
        if (!valid) throw { status: 401, message: "Incorrect PIN" };

        return { success: true };
    }

    static async updatePin(adultId, newPin) {
        if (!newPin || String(newPin).length !== 4) {
            throw { status: 400, message: "PIN must be 4 digits" };
        }
        const hashedPin = await bcrypt.hash(String(newPin), 10);
        await AdultAccountModel.updatePin(adultId, hashedPin);
        return { success: true, message: "PIN updated" };
    }

    static async forgotPassword(email) {
        if (!email) throw { status: 400, message: "Email required" };

        const user = await AdultAccountModel.findByEmail(email);

        // CORRECTION: Vérification de l'objet simple
        if (user) {
            const token = crypto.randomBytes(32).toString("hex");
            await AdultAccountModel.saveResetToken(email, token);

            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/?resetToken=${token}`;

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: process.env.SMTP_PORT == 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            try {
                await transporter.sendMail({
                    from: `"SixHuit" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: "Password Reset",
                    html: `
            <div style="font-family: sans-serif; text-align: center;">
                <h2>Password Reset</h2>
                <p>Click the button below to reset your password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #6806ed; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
                <p style="font-size: 11px; color: #888; margin-top: 20px;">This email was sent from support@sixhuit.fr</p>
            </div>
        `,
                });
            } catch (error) {
                console.error("SMTP Error:", error.message);
                throw { status: 503, message: "Email service unavailable" };
            }
        }

        return {
            success: true,
            message: "If the account exists, an email has been sent",
        };
    }

    static async resetPassword(token, newPassword) {
        const userRows = await AdultAccountModel.findByResetToken(token);

        // findByResetToken renvoie un tableau car il n'a pas été modifié en rows[0]
        if (!userRows || userRows.length === 0)
            throw { status: 400, message: "Invalid or expired link" };

        const hashed = await bcrypt.hash(newPassword, 10);
        await AdultAccountModel.updatePassword(userRows[0].id, hashed);
        return { success: true, message: "Password updated successfully" };
    }

    static async registerChild(adultId, data) {
        const result = await ChildAccountModel.create({
            adultId,
            name: data.name,
            age: data.age,
            instrument: data.instrument,
            time_amount: data.time_amount,
            school: data.school,
            mascot: data.mascot,
            lesson_day: data.lesson_day,
        });

        // CORRECTION: On récupère l'id de la première ligne insérée
        const childId = result[0].id;

        const mapDays = {
            Lundi: "monday",
            Mardi: "tuesday",
            Mercredi: "wednesday",
            Jeudi: "thursday",
            Vendredi: "friday",
            Samedi: "saturday",
            Dimanche: "sunday",
        };

        for (const day of Object.keys(mapDays)) {
            const english = mapDays[day];
            const status = data.days.includes(day) ? true : false;
            await WeeklyPlanModel.setDay(childId, english, status);
        }

        await StreakModel.updateStreak(childId, 0);
        return { success: true, childId };
    }

    static async login({ email, password }) {
        const user = await AdultAccountModel.findByEmail(email);

        // CORRECTION: user est l'objet ou undefined
        if (!user) throw { status: 404, message: "User not found" };

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) throw { status: 401, message: "Incorrect password" };

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return { message: "Login success", token, adultId: user.id };
    }

    static async verifyPassword(adultId, password) {
        const user = await AdultAccountModel.findById(adultId);

        if (!user)
            throw { status: 404, message: "User not found" };

        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) throw { status: 401, message: "Incorrect password" };
        return { success: true };
    }
}