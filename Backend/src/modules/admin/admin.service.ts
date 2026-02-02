import { prisma } from "../../../lib/pisma";
import { Role } from "../../../generated/prisma/client";
import { ApiError } from "../../utils/ApiError";

const getAllUsers = async (filters?: {
  role?: string;
  search?: string;
}) => {
  const where: any = {};

  if (filters?.role) {
    where.role = filters.role;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
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
        select: {
          id: true,
          biography: true,
          qualifications: true,
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const updateUserStatus = async (
  userId: string,
  updateData: {
    role?: string;
    emailVerified?: boolean;
    name?: string;
    email?: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const validRoles = ["USER", "STUDENT", "TUTOR", "ADMIN"];
  if (updateData.role && !validRoles.includes(updateData.role)) {
    throw ApiError.badRequest(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  // If becoming a tutor, create tutor profile if it doesn't exist
  if (updateData.role === "TUTOR") {
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      await prisma.tutorProfile.create({
        data: {
          userId,
          biography: "",
          profileImage: "",
          qualifications: "",
        },
      });
    }
  }

  const dataToUpdate: any = {};
  if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
  if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
  if (updateData.emailVerified !== undefined) dataToUpdate.emailVerified = updateData.emailVerified;
  if (updateData.role !== undefined) dataToUpdate.role = updateData.role as Role;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
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

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
};

const getAllBookings = async (filters?: {
  status?: string;
  tutorId?: string;
  studentId?: string;
}) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.tutorId) {
    where.tutorId = filters.tutorId;
  }

  if (filters?.studentId) {
    where.studentId = filters.studentId;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
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
      createdAt: "desc",
    },
  });

  return bookings;
};

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalReviews,
    totalCategories,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.review.count(),
    prisma.category.count(),
  ]);

  // Get recent bookings
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        select: { id: true, name: true, image: true },
      },
      tutor: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
    },
  });

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  return {
    users: {
      total: totalUsers,
      tutors: totalTutors,
      students: totalStudents,
    },
    bookings: {
      total: totalBookings,
      completed: completedBookings,
      pending: pendingBookings,
      cancelled: cancelledBookings,
    },
    totalReviews,
    totalCategories,
    recentBookings,
    recentUsers,
  };
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  getDashboardStats,
};
