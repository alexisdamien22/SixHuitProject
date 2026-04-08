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
            const err = new Error("User already exists");
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

        return { message: "Account created successfully", token, adultId };
    }

    static async getProfile(adultId) {
        const user = await AdultAccountModel.findById(adultId);
        if (user.length === 0) {
            const err = new Error("Profile not found");
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
        if (rows.length === 0) throw { status: 404, message: "User not found" };
        const hashedPin = rows[0].pin;
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

        if (user && user.length > 0) {
            const token = crypto.randomBytes(32).toString("hex");

            await AdultAccountModel.saveResetToken(email, token);

            const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/?resetToken=${token}`;

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
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
                            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background: #6806ed; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                            <p style="font-size: 12px; color: #888; margin-top: 20px;">This link expires in 1 hour.</p>
                        </div>
                    `,
                });
            } catch (mailError) {
                console.error("Nodemailer Error:", mailError.message);
                throw { status: 503, message: "Email service unavailable" };
            }
        }

        return {
            success: true,
            message: "If the account exists, an email has been sent",
        };
    }

    static async resetPassword(token, newPassword) {
        const user = await AdultAccountModel.findByResetToken(token);
        if (!user || user.length === 0)
            throw { status: 400, message: "Invalid or expired link" };

        const hashed = await bcrypt.hash(newPassword, 10);
        await AdultAccountModel.updatePassword(user[0].id, hashed);
        return { success: true, message: "Password updated successfully" };
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
            const status = data.days.includes(day) ? 1 : 0;
            await WeeklyPlanModel.setDay(childId, english, status);
        }

        await StreakModel.updateStreak(childId, 0);
        return { success: true, childId };
    }

    static async login({ email, password }) {
        const user = await AdultAccountModel.findByEmail(email);
        if (user.length === 0) throw { status: 404, message: "User not found" };

        const account = user[0];
        const valid = await bcrypt.compare(password, account.password_hash);
        if (!valid) throw { status: 401, message: "Incorrect password" };

        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return { message: "Login success", token, adultId: account.id };
    }
}
