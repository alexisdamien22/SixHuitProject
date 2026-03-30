import db from "../db/connection.js";

export class BaseModel {
    static query(sql, params = []) {
        return db.execute(sql, params).then(([rows]) => rows);
    }
}