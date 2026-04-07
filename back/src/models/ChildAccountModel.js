import { BaseModel } from "./BaseModel.js";

export class ChildAccountModel extends BaseModel {
    static create(data) {
        return this.query(
            `INSERT INTO childaccount 
       (adultId, name, age, instrument, time_amount, school, mascot, lesson_day)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.adultId ?? null,
                data.name ?? null,
                data.age ?? null,
                data.instrument ?? null,
                data.time_amount ?? null,
                data.school ?? null,
                data.mascot ?? null,
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
