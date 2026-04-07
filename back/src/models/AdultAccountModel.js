import { BaseModel } from "./BaseModel.js";

export class AdultAccountModel extends BaseModel {
    static findByEmail(email) {
        return this.query("SELECT * FROM adultaccount WHERE email = ?", [
            email,
        ]);
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
}
