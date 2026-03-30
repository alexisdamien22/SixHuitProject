import { BaseModel } from "./BaseModel.js";

export class ChildAccountModel extends BaseModel {
    static create(data) {
        return this.query(
            `INSERT INTO childaccount 
       (adultId, name, age, instrument, duree, ecole, mascotte)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.adultId,
                data.name,
                data.age,
                data.instrument,
                data.duree,
                data.ecole,
                data.mascotte
            ]
        );
    }

    static findById(id) {
        return this.query(
            "SELECT * FROM childaccount WHERE id = ?",
            [id]
        );
    }

    static findByAdult(adultId) {
        return this.query(
            "SELECT * FROM childaccount WHERE adultId = ?",
            [adultId]
        );
    }
}