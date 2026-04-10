import sql from "../db/connection.js";

export class BaseModel {
    static async query(queryText, params = []) {
        try {
            // Transforme les "?" en "$1, $2, $3..." pour la compatibilité Postgres
            let i = 1;
            const postgresQuery = queryText.replace(/\?/g, () => `$${i++}`);

            // Utilise sql.unsafe pour exécuter la chaîne de caractères avec les paramètres
            return await sql.unsafe(postgresQuery, params);
        } catch (error) {
            console.error("❌ Erreur SQL dans BaseModel:", error.message);
            throw error;
        }
    }
}