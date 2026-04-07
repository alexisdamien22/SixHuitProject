import { Router } from "express";
import { SocialController } from "../controllers/SocialController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/search", SocialController.search);
router.post("/follow", SocialController.follow);
router.get("/recommendations", SocialController.getRecommendations);
router.get("/friends", SocialController.getFriends);

export default router;
