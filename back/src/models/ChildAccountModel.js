import { BaseModel } from "./BaseModel.js";

export class ChildAccountModel extends BaseModel {
    static create(data) {
        return this.query(
            `INSERT INTO childaccount 
       (adultId, name, age, instrument, time_amount, school, mascot, lesson_day)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.adultId,
                data.name,
                data.age,
                data.instrument ?? null,
                data.time_amount,
                data.school ?? null,
                data.mascot,
                data.lesson_day ?? null,
            ],
        );
    }

    static findById(id) {
        return this.query("SELECT * FROM childaccount WHERE id = ?", [id]);
    }

    static findByAdultId(adultId) {
        return this.query("SELECT * FROM childaccount WHERE adultId = ?", [
            adultId,
        ]);
    }
}
