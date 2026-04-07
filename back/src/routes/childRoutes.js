import { Router } from "express";
import { ChildController } from "../controllers/ChildController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkChildOwnership } from "../middleware/checkChildOwnership.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware);
router.use("/:childId", checkChildOwnership);

router.get("/:childId", asyncHandler(ChildController.getChildData));
router.post("/:childId/session", asyncHandler(ChildController.updateSession));
router.post(
    "/:childId/weekly-plan",
    asyncHandler(ChildController.updateWeeklyPlan),
);
router.post("/:childId/streak", asyncHandler(ChildController.updateStreak));

export default router;
