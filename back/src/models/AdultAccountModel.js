import { BaseModel } from "./BaseModel.js";

export class AdultAccountModel extends BaseModel {
    static findByEmail(email) {
        return this.query(
            "SELECT id, email, password_hash, teacher, pin FROM adultaccount WHERE email = ?",
            [email],
        );
    }

    static create({ email, password, teacher, pin }) {
        return this.query(
            "INSERT INTO adultaccount (email, password_hash, teacher, pin) VALUES (?, ?, ?, ?)",
            [
                email,
                password,
                teacher !== undefined ? teacher : 0,
                pin !== undefined ? pin : null,
            ],
        );
    }

    static findById(id) {
        return this.query(
            "SELECT id, email, teacher, pin, created_at FROM adultaccount WHERE id = ?",
            [id],
        );
    }

    static updatePin(id, pinHash) {
        return this.query("UPDATE adultaccount SET pin = ? WHERE id = ?", [
            pinHash,
            id,
        ]);
    }

    static saveResetToken(email, token) {
        return this.query(
            "UPDATE adultaccount SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
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
