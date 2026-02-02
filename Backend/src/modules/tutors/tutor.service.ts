import { prisma } from "../../../lib/pisma";
import { ApiError } from "../../utils/ApiError";

const alltutors = async (filters?: {
  category?: string;
  search?: string;
  minRating?: number;
}) => {
  const where: any = {
    role: "TUTOR",
  };

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const tutors = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          biography: true,
          profileImage: true,
          qualifications: true,
          categories: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          availability: {
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              reviewDate: true,
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
    },
  });

  // Filter by category if provided
  let filteredTutors = tutors;
  if (filters?.category) {
    filteredTutors = tutors.filter((tutor) =>
      tutor.tutorProfile?.categories.some((cat) => cat.id === filters.category)
    );
  }

  // Calculate average rating for each tutor
  const tutorsWithRating = filteredTutors.map((tutor) => {
    const reviews = tutor.tutorProfile?.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length
        : 0;

    return {
      ...tutor,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    };
  });

  // Filter by minimum rating if provided
  if (filters?.minRating) {
    return tutorsWithRating.filter((t) => t.averageRating >= filters.minRating!);
  }

  return tutorsWithRating;
};

const getTutorById = async (id: string) => {
  const tutor = await prisma.user.findFirst({
    where: {
      id,
      role: "TUTOR",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          biography: true,
          profileImage: true,
          qualifications: true,
          categories: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          availability: {
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              reviewDate: true,
              student: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          bookings: {
            select: {
              id: true,
              sessionDate: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!tutor) {
    throw ApiError.notFound("Tutor not found");
  }

  // Calculate average rating
  const reviews = tutor.tutorProfile?.reviews || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length
      : 0;

  return {
    ...tutor,
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
    completedSessions:
      tutor.tutorProfile?.bookings?.filter((b) => b.status === "COMPLETED").length || 0,
  };
};

const tutorCategory = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { tutors: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  return categories;
};

const createCategory = async (data: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw ApiError.badRequest("Category already exists");
  }

  const newCategory = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description || "",
    },
  });
  return newCategory;
};

const updateCategory = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  const updated = await prisma.category.update({
    where: { id },
    data,
  });

  return updated;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category deleted successfully" };
};

const updateTutorProfile = async (
  id: string,
  profileData: {
    biography?: string;
    profileImage?: string;
    qualifications?: string;
    categoryIds?: string[];
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const { categoryIds, ...profileFields } = profileData;

  const updatedProfile = await prisma.tutorProfile.update({
    where: { userId: id },
    data: {
      ...profileFields,
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((cid) => ({ id: cid })),
        },
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      categories: true,
    },
  });

  return updatedProfile;
};

const availableStatus = async (data: {
  tutorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}) => {
  const { startTime, endTime, dayOfWeek, tutorId } = data;

  if (!tutorId || !dayOfWeek || !startTime || !endTime) {
    throw ApiError.badRequest("All fields are required: tutorId, dayOfWeek, startTime, endTime");
  }

  const existingTutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });

  if (!existingTutor) {
    throw ApiError.notFound("Tutor profile not found");
  }

  // Check for existing availability on same day
  const existingSlot = await prisma.availability.findFirst({
    where: {
      tutorId,
      dayOfWeek,
    },
  });

  if (existingSlot) {
    // Update existing slot instead of creating new
    const updated = await prisma.availability.update({
      where: { id: existingSlot.id },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    return updated;
  }

  const availability = await prisma.availability.create({
    data: {
      tutorId,
      dayOfWeek,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

  return availability;
};

const deleteAvailability = async (id: string) => {
  const availability = await prisma.availability.findUnique({
    where: { id },
  });

  if (!availability) {
    throw ApiError.notFound("Availability not found");
  }

  await prisma.availability.delete({
    where: { id },
  });

  return { message: "Availability deleted successfully" };
};

const createTutorProfile = async (data: {
  userId: string;
  biography?: string;
  profileImage?: string;
  qualifications?: string;
  categoryIds?: string[];
}) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const existingProfile = await prisma.tutorProfile.findUnique({
    where: { userId: data.userId },
  });

  const { categoryIds, ...profileFields } = data;

  if (existingProfile) {
    const updateData: any = {};
    if (profileFields.biography !== undefined) updateData.biography = profileFields.biography;
    if (profileFields.profileImage !== undefined) updateData.profileImage = profileFields.profileImage;
    if (profileFields.qualifications !== undefined) updateData.qualifications = profileFields.qualifications;
    if (categoryIds) {
      updateData.categories = { set: categoryIds.map((cid) => ({ id: cid })) };
    }

    const updatedProfile = await prisma.tutorProfile.update({
      where: { userId: data.userId },
      data: updateData,
      include: {
        categories: true,
      },
    });
    return updatedProfile;
  }

  const newProfile = await prisma.tutorProfile.create({
    data: {
      userId: data.userId,
      biography: profileFields.biography || "",
      profileImage: profileFields.profileImage || "",
      qualifications: profileFields.qualifications || "",
      ...(categoryIds && {
        categories: {
          connect: categoryIds.map((cid) => ({ id: cid })),
        },
      }),
    },
    include: {
      categories: true,
    },
  });

  // Update user role to TUTOR
  await prisma.user.update({
    where: { id: data.userId },
    data: { role: "TUTOR" },
  });

  return newProfile;
};

export const tutorService = {
  alltutors,
  getTutorById,
  tutorCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  updateTutorProfile,
  availableStatus,
  deleteAvailability,
  createTutorProfile,
};
