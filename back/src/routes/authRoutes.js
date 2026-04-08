import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();

router.post("/register-adult", AuthController.registerAdult);
router.post("/register-child", authMiddleware, AuthController.registerChild);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-pin", authMiddleware, AuthController.verifyPin);
router.post("/update-pin", authMiddleware, AuthController.updatePin);
router.get("/profile", authMiddleware, AuthController.getProfile);
router.post("/verify-password", authMiddleware, AuthController.verifyPassword);

router.get("/me", AuthController.getProfile);

router.get("/children", authMiddleware, AuthController.getChildren);

export default router;
