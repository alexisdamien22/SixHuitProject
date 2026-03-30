import express from "express";
import jwt from "jsonwebtoken";
import { UserManager } from "../managers/UserManager.js";
import { ChildAccountManager } from "../managers/ChildAccountManager.js";
import { WeeklyPlanManager } from "../managers/WeeklyPlanManager.js";
import { StreaksManager } from "../managers/StreaksManager.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_fallback";

const DAYS_MAP = {
  L: "monday",
  Ma: "tuesday",
  Me: "wednesday",
  J: "thursday",
  V: "friday",
  S: "saturday",
  D: "sunday",
};

router.post("/register", async (req, res) => {
  try {
    const { email, password, jours, ...otherData } = req.body;

    const existingUser = await UserManager.findByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "E-mail déjà utilisé." });
    }

    const adultId = await UserManager.create(email, password);
    const childData = { email, password, jours, ...otherData };
    const childId = await ChildAccountManager.create(childData, adultId);

    if (Array.isArray(jours)) {
      for (const j of jours) {
        if (DAYS_MAP[j]) {
          await WeeklyPlanManager.setDay(childId, DAYS_MAP[j], 1, "#7b2fbe");
        }
      }
    }

    await StreaksManager.update(childId, 0, null);

    const token = jwt.sign({ userId: adultId, childId }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(201).json({ success: true, token, childId });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Erreur interne du serveur." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserManager.findByEmail(email);
    if (!user || !(await UserManager.verifyPassword(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, error: "Identifiants incorrects." });
    }

    const children = await ChildAccountManager.getChildrenOfAdult(user.id);
    if (!children || children.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Aucun profil enfant trouvé." });
    }

    const childId = children[0].id;
    const token = jwt.sign({ userId: user.id, childId }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({ success: true, token, childId });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Erreur interne du serveur." });
  }
});

export default router;
