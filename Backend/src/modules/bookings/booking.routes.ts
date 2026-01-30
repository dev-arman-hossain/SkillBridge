import { Router } from "express";
import { bookingController } from "./booking.controller";

const router: Router = Router();

router.post("/", bookingController.bookSession);
router.patch("/:id", bookingController.updateBooking);

export const bookingRoutes = router;