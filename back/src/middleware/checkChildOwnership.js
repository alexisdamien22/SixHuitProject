import { ChildAccountModel } from "../models/ChildAccountModel.js";

export async function checkChildOwnership(req, res, next) {
    const childId = req.params.childId;
    const adultId = req.user.id;

    if (!childId) return next();

    try {
        const child = await ChildAccountModel.findById(childId);

        if (!child) {
            return res.status(404).json({ error: "Enfant introuvable." });
        }

        const childOwnerId = child.adultid || child.adult_id || child.adultId;

        if (childOwnerId !== adultId) {
            return res
                .status(403)
                .json({ error: "Accès refusé. Cet enfant ne vous appartient pas." });
        }

        next();
    } catch (err) {
        console.error("Erreur Ownership Middleware:", err);
        res.status(500).json({ error: "Erreur serveur lors de la vérification des droits." });
    }
}
