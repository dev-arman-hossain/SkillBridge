import { Request, Response, Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";
import { prisma } from "../../../lib/pisma";

const router: Router = Router();

router.get("/categories", tutorController.tutorCategory);
router.put("/tutor/profile", tutorController.createTutorProfile);
router.post("/session", tutorController.availableStatus);
router.get("/session", async (req: Request, res: Response) => {
  try {
    const { AvailabilityID } = req.query;
    const Availability = await prisma.availability.findMany({
      where: {
        id: AvailabilityID as string,
      },
      include: {
        tutor: true,
      },
    });
    return res.status(201).json({
      data: Availability,
      success: true,
      message: "Availability created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `session createion failed: ${error.message}`,
    });
  }
});

router.get("/tutors", tutorController.getAllTutors);
router.get("/tutors/:id", tutorController.getTutorById);
router.post("/category", tutorController.createCategory);
router.patch("/tutors/profile/:id", auth(UserRole.TUTOR), tutorController.updateTutorProfile);

export const tutorRoutes = router;
