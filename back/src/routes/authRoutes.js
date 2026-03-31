import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();

router.post("/register-adult", AuthController.registerAdult);
router.post("/register-child", authMiddleware, AuthController.registerChild);
router.post("/login", AuthController.login);

router.get("/me", AuthController.getProfile);

export default router;