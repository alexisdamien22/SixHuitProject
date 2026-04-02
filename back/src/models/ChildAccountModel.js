import { BaseModel } from "./BaseModel.js";

export class ChildAccountModel extends BaseModel {
    static create(data) {
        return this.query(
            `INSERT INTO childaccount 
       (adultId, name, age, instrument, time_amount, school, mascot)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.adultId,
                data.name,
                data.age,
                data.instrument,
                data.time_amount,
                data.school,
                data.mascot
            ]
        );
    }

    static findById(id) {
        return this.query(
            "SELECT * FROM childaccount WHERE id = ?",
            [id]
        );
    }

    static findByAdultId(adultId) {
        return this.query(
            "SELECT * FROM childaccount WHERE adultId = ?",
            [adultId]
        );
    }
}