import { Router } from "express";
import { adminController } from "./admin.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router: Router = Router();

// Dashboard stats
router.get("/stats", auth(UserRole.ADMIN), adminController.getDashboardStats);

// User management
router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.delete("/users/:id", auth(UserRole.ADMIN), adminController.deleteUser);

// Booking management
router.get("/bookings", auth(UserRole.ADMIN), adminController.getAllBookings);

export const adminRoutes = router;
