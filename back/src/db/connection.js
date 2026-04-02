import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "six_huit_production",
  connectionLimit: 10,
});

db.getConnection()
  .then(() => console.log("✅ Connexion à la base de données réussie"))
  .catch((err) =>
    console.error("❌ ÉCHEC de connexion à la base de données:", err.message),
  );
