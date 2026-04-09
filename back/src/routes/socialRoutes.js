import { Router } from "express";
import { SocialController } from "../controllers/SocialController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkChildOwnership } from "../middleware/checkChildOwnership.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware);
router.use("/:childId", checkChildOwnership);

router.get("/:childId/search", asyncHandler(SocialController.search));
router.post("/:childId/follow", asyncHandler(SocialController.follow));
router.get(
    "/:childId/recommendations",
    asyncHandler(SocialController.getRecommendations),
);
router.get("/:childId/friends", asyncHandler(SocialController.getFriends));
router.post(
    "/:childId/interact/:targetId",
    asyncHandler(SocialController.interact),
);
router.get(
    "/:childId/notifications",
    asyncHandler(SocialController.getNotifications),
);
router.post(
    "/:childId/subscribe-push",
    asyncHandler(SocialController.subscribePush),
);

export default router;
