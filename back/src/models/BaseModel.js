import sql from "../db/connection.js";

export class BaseModel {
    static async query(queryText, params = []) {
        try {
            // Remplace les "?" par "$1", "$2", etc.
            let i = 1;
            const postgresQuery = queryText.replace(/\?/g, () => `$${i++}`);

            const result = await sql.unsafe(postgresQuery, params);
            return result;
        } catch (error) {
            console.error("❌ Erreur SQL:", error.message);
            throw error;
        }
    }
}