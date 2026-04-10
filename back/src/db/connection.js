import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    console.error("❌ Erreur : DATABASE_URL est vide. Vérifie ton fichier .env");
}

const sql = postgres(connectionString, {
    ssl: 'require', // Supabase refuse les connexions non sécurisées
    connect_timeout: 10
})

// Petit test de connexion automatique
sql`SELECT 1`.then(() => {
    console.log("✅ Connecté à Supabase avec succès !");
}).catch(err => {
    console.error("❌ Erreur de connexion Supabase :", err.message);
});

export default sql