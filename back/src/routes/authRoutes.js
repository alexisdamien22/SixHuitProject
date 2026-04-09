import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { AuthController } from "../controllers/AuthController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register-adult", asyncHandler(AuthController.registerAdult));
router.post(
    "/register-child",
    authMiddleware,
    asyncHandler(AuthController.registerChild),
);
router.post("/login", asyncHandler(AuthController.login));
router.post("/forgot-password", asyncHandler(AuthController.forgotPassword));
router.post("/reset-password", asyncHandler(AuthController.resetPassword));
router.post(
    "/verify-pin",
    authMiddleware,
    asyncHandler(AuthController.verifyPin),
);
router.post(
    "/update-pin",
    authMiddleware,
    asyncHandler(AuthController.updatePin),
);
router.get("/profile", authMiddleware, asyncHandler(AuthController.getProfile));
router.post(
    "/verify-password",
    authMiddleware,
    asyncHandler(AuthController.verifyPassword),
);

router.get("/me", authMiddleware, asyncHandler(AuthController.getProfile));
router.get(
    "/children",
    authMiddleware,
    asyncHandler(AuthController.getChildren),
);

export default router;
