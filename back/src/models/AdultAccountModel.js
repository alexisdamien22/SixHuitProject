import { BaseModel } from "./BaseModel.js";

export class AdultAccountModel extends BaseModel {
    static async findByEmail(email) {
        const rows = await this.query(
            "SELECT id, email, password_hash, teacher, pin FROM adultaccount WHERE email = ?",
            [email],
        );
        return rows[0];
    }

    static create({ email, password, teacher, pin }) {
        return this.query(
            "INSERT INTO adultaccount (email, password_hash, teacher, pin) VALUES (?, ?, ?, ?)",
            [
                email,
                password,
                teacher !== undefined ? teacher : false,
                pin !== undefined ? pin : null,
            ],
        );
    }

    static async findById(id) {
        const rows = await this.query(
            "SELECT id, email, teacher, pin, created_at FROM adultaccount WHERE id = ?",
            [id],
        );
        return rows[0];
    }

    static updatePin(id, pinHash) {
        return this.query("UPDATE adultaccount SET pin = ? WHERE id = ?", [pinHash, id]);
    }

    static saveResetToken(email, token) {
        // Syntaxe Postgres pour ajouter 1 heure
        return this.query(
            "UPDATE adultaccount SET reset_token = ?, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE email = ?",
            [token, email],
        );
    }

    static findByResetToken(token) {
        return this.query(
            "SELECT * FROM adultaccount WHERE reset_token = ? AND reset_token_expires > NOW()",
            [token],
        );
    }

    static updatePassword(id, hashedPassword) {
        return this.query(
            "UPDATE adultaccount SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
            [hashedPassword, id],
        );
    }
}