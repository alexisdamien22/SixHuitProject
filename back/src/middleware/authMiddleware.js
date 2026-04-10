import jwt from "jsonwebtoken";
import { AdultAccountModel } from "../models/AdultAccountModel.js";

export async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant ou format invalide" });
    }

    const token = header.split(" ")[1];

    try {
        // 1. On vérifie la signature du jeton
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. IMPORTANT: On vérifie que l'utilisateur existe toujours dans la base PostgreSQL
        // Puisque tu as fait un TRUNCATE, les anciens IDs dans les tokens n'existent plus.
        const user = await AdultAccountModel.findById(decoded.id);

        if (!user) {
            // C'est ici que l'erreur "vérification des droits" est souvent déclenchée
            return res.status(403).json({ error: "Erreur serveur lors de la vérification des droits." });
        }

        // 3. On stocke l'objet utilisateur complet dans req.user
        req.user = user;

        next();
    } catch (err) {
        console.error("Erreur Middleware Auth:", err.message);
        res.status(401).json({ error: "Token invalide ou expiré" });
    }
}