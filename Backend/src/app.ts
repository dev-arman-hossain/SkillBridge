import { toNodeHandler } from "better-auth/node";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { auth } from "../lib/auth";
import { tutorRoutes } from "./modules/tutors/tutor.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { reviewRoutes } from "./modules/reviews/review.routes";

dotenv.config();

const app: Application = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", tutorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

export default app;