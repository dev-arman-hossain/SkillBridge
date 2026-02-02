import { Request, Response, Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";
import { prisma } from "../../../lib/pisma";
import { sendSuccess, sendError } from "../../utils/ApiError";

const router: Router = Router();

// Public routes
router.get("/categories", tutorController.tutorCategory);
router.get("/tutors", tutorController.getAllTutors);
router.get("/tutors/:id", tutorController.getTutorById);

// Availability routes
router.get("/tutor/availability", async (req: Request, res: Response) => {
  try {
    const { availabilityId, tutorId } = req.query;

    const whereClause: any = {};
    if (typeof availabilityId === "string") whereClause.id = availabilityId;
    if (typeof tutorId === "string") whereClause.tutorId = tutorId;

    const availability = await prisma.availability.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return sendSuccess(res, availability, "Availability retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
});

router.put("/tutor/availability", auth(UserRole.TUTOR), tutorController.availableStatus);
router.delete("/tutor/availability/:id", auth(UserRole.TUTOR), tutorController.deleteAvailability);

// Tutor profile routes
router.put("/tutor/profile", auth(UserRole.TUTOR, UserRole.USER), tutorController.createTutorProfile);
router.patch("/tutors/profile/:id", auth(UserRole.TUTOR), tutorController.updateTutorProfile);

// Category management (Admin only)
router.post("/categories", auth(UserRole.ADMIN), tutorController.createCategory);
router.patch("/categories/:id", auth(UserRole.ADMIN), tutorController.updateCategory);
router.delete("/categories/:id", auth(UserRole.ADMIN), tutorController.deleteCategory);

export const tutorRoutes = router;
