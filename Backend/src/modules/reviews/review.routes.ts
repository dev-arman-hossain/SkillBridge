import { Router } from "express";
import { reviewController } from "./review.controller";

const router: Router = Router();

router.post("/", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.get("/tutor/:tutorId", reviewController.getTutorReviews);
router.get("/student/:studentId", reviewController.getStudentReviews);

export const reviewRoutes = router;
