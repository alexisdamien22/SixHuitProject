import { Router } from "express";
import { ChildController } from "../controllers/ChildController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/:childId", ChildController.getChildData);
router.post("/:childId/session", ChildController.updateSession);
router.post("/:childId/weekly-plan", ChildController.updateWeeklyPlan);
router.post("/:childId/streak", ChildController.updateStreak);

export default router;
