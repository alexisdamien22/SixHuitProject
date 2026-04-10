import jwt from "jsonwebtoken";
import { AdultAccountModel } from "../models/AdultAccountModel.js";

export async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Token manquant" });

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Sans le 'async' en haut, cette ligne fait crasher le serveur (Erreur 500)
        const user = await AdultAccountModel.findById(decoded.id);

        if (!user) {
            return res.status(403).json({ error: "Utilisateur introuvable" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Crash Middleware:", err);
        res.status(401).json({ error: "Session expirée" });
    }
}