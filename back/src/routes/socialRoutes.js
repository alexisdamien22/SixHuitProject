import { Router } from "express";
import { SocialController } from "../controllers/SocialController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkChildOwnership } from "../middleware/checkChildOwnership.js";

const router = Router();

router.use(authMiddleware);

router.use("/:childId", checkChildOwnership);

router.get("/:childId/search", SocialController.search);
router.post("/:childId/follow", SocialController.follow);
router.get("/:childId/recommendations", SocialController.getRecommendations);
router.get("/:childId/friends", SocialController.getFriends);

router.post("/:childId/interact/:targetId", SocialController.interact);
router.get("/:childId/notifications", SocialController.getNotifications);

export default router;
