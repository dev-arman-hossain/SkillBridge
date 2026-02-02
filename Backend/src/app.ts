import { toNodeHandler } from "better-auth/node";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { auth } from "../lib/auth";
import { tutorRoutes } from "./modules/tutors/tutor.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { reviewRoutes } from "./modules/reviews/review.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { userRoutes } from "./modules/users/user.routes";

dotenv.config();

const app: Application = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Auth routes (better-auth)
app.all("/api/auth/*splat", toNodeHandler(auth));

// API routes
app.use("/api", tutorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "SkillBridge API is running" });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
