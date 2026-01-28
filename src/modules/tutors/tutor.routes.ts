import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router: Router = Router();

router.get("/categories", auth(UserRole.TUTOR),tutorController.tutorCategory);
router.get("/tutors", tutorController.getAllTutors)
router.get("/tutors/:id", tutorController.getTutorById);
router.post("/category", tutorController.createCategory);
router.patch("/tutors/profile/:id", auth(UserRole.TUTOR),tutorController.updateTutorProfile);

export const tutorRoutes = router;