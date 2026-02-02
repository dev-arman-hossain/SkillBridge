import { prisma } from "../../../lib/pisma";
import { ApiError } from "../../utils/ApiError";

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      tutorProfile: {
        include: {
          categories: true,
          availability: true,
          reviews: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
      bookings: {
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
          sessionDate: "desc",
        },
        take: 10,
      },
      reviews: {
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          reviewDate: "desc",
        },
        take: 10,
      },
    },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

const updateUserProfile = async (
  id: string,
  data: {
    name?: string;
    image?: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.image !== undefined) updateData.image = data.image;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const updateUserRole = async (id: string, role: string) => {
  const validRoles = ["USER", "STUDENT", "TUTOR", "ADMIN"];
  if (!validRoles.includes(role)) {
    throw ApiError.badRequest(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // If becoming a tutor, create tutor profile if it doesn't exist
  if (role === "TUTOR") {
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: id },
    });

    if (!existingProfile) {
      await prisma.tutorProfile.create({
        data: {
          userId: id,
          biography: "",
          profileImage: "",
          qualifications: "",
        },
      });
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: role as any },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      tutorProfile: true,
    },
  });

  return updatedUser;
};

const getDashboardStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (user.role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw ApiError.notFound("Tutor profile not found");
    }

    const [totalBookings, completedSessions, pendingSessions, reviews] = await Promise.all([
      prisma.booking.count({ where: { tutorId: tutorProfile.id } }),
      prisma.booking.count({ where: { tutorId: tutorProfile.id, status: "COMPLETED" } }),
      prisma.booking.count({ where: { tutorId: tutorProfile.id, status: "PENDING" } }),
      prisma.review.findMany({
        where: { tutorId: tutorProfile.id },
        select: { rating: true },
      }),
    ]);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length
        : 0;

    return {
      role: "TUTOR",
      totalBookings,
      completedSessions,
      pendingSessions,
      totalReviews: reviews.length,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  }

  // Student stats
  const [totalBookings, completedSessions, pendingSessions, reviewsGiven] = await Promise.all([
    prisma.booking.count({ where: { studentId: userId } }),
    prisma.booking.count({ where: { studentId: userId, status: "COMPLETED" } }),
    prisma.booking.count({ where: { studentId: userId, status: "PENDING" } }),
    prisma.review.count({ where: { studentId: userId } }),
  ]);

  return {
    role: user.role,
    totalBookings,
    completedSessions,
    pendingSessions,
    reviewsGiven,
  };
};

export const userService = {
  getUserById,
  updateUserProfile,
  updateUserRole,
  getDashboardStats,
};
