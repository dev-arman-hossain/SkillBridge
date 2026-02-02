import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth.middleware";

const router: Router = Router();

// Protected routes - require authentication
router.get("/me", auth(), userController.getMe);
router.patch("/me", auth(), userController.updateProfile);
router.patch("/me/role", auth(), userController.updateRole);
router.get("/me/stats", auth(), userController.getDashboardStats);

// Get user by ID (public for viewing profiles)
router.get("/:id", userController.getUserById);

export const userRoutes = router;
