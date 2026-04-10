import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    connect_timeout: 30,
    // Cette option force Node à préférer l'IPv4
    prepare: false
});

// Test de connexion
sql`SELECT 1`.then(() => {
    console.log("🚀 Connecté avec succès via IPv4 !");
}).catch(err => {
    console.error("❌ Erreur de connexion :", err.message);
});

export default sql;