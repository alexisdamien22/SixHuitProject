import { ChildAccountModel } from "../models/ChildAccountModel.js";

export async function checkChildOwnership(req, res, next) {
  const childId = req.params.childId;
  const adultId = req.user.id;

  if (!childId) return next();

  try {
    const child = await ChildAccountModel.findById(childId);

    if (child.length === 0) {
      return res.status(404).json({ error: "Enfant introuvable." });
    }

    if (child[0].adultId !== adultId) {
      return res
        .status(403)
        .json({ error: "Accès refusé. Cet enfant ne vous appartient pas." });
    }

    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la vérification des droits." });
  }
}
