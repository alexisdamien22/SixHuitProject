import { Router } from "express";
import { ChildController } from "../controllers/ChildController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkChildOwnership } from "../middleware/checkChildOwnership.js";

const router = Router();

router.use(authMiddleware);
router.use("/:childId", checkChildOwnership);

router.get("/:childId", ChildController.getChildData);
router.post("/:childId/session", ChildController.updateSession);
router.post("/:childId/weekly-plan", ChildController.updateWeeklyPlan);
router.post("/:childId/streak", ChildController.updateStreak);

export default router;
