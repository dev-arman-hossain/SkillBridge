import { Request, Response } from "express";
import { prisma } from "../../../lib/pisma";

const alltutors = async (req: Request, res: Response) => {
  const tutors = await prisma.user.findMany({
    where: {
      role: "TUTOR",
    },
  });
  return tutors;
};

const getTutorById = async (id: string) => {
  const singleTutor = await prisma.user.findUnique({
    where: {
      role: "TUTOR",
      id: id,
    },
  });
  return singleTutor;
};
const tutorCategory = async () => {
  const tutionCategory = await prisma.category.findMany();
  return tutionCategory;
};

const createCategory = async (data: any) => {
  const newCategory = await prisma.category.create({
    data: data,
  });
  return newCategory;
};

const updateTutorProfile = async (
  id: string,
  profileData: {
    biography?: string;
    profileImage?: string;
    qualifications?: string;
  },
) => {
  const tutorData = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const updatedTutorProfile = await prisma.tutorProfile.update({
    where: {
      userId: id,
    },
    data: {
      biography: profileData.biography as string,
      profileImage: profileData.profileImage as string,
      qualifications: profileData.qualifications as string,
    },
    include: {
      user: true,
    },
  });

  return updatedTutorProfile;
};

const availableStatus = async (data: any) => {
  const { startTime, endTime, dayOfWeek, tutorId } = data;

  console.log(data)
  const existingTutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
  });

   console.log(existingTutor)

  if (!existingTutor) {
    throw new Error("Tutor profile not found");
  }


  const availability = await prisma.availability.create({
    data: {
      tutorId,
      dayOfWeek,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

   console.log(availability)

  return availability;
};

const createTutorProfile = async (data: any) => {

  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: data.userId,
    },
  });

  if (existingProfile) {
    const updatedProfile = await prisma.tutorProfile.update({
      where: {
        userId: data.userId,
      },
      data: {
        biography: data.biography,
        profileImage: data.profileImage,
        qualifications: data.qualifications,
      },
    });
    return updatedProfile;
  } else {
    const newProfile = await prisma.tutorProfile.create({
      data: {
        userId: data.userId,
        biography: data.biography,
        profileImage: data.profileImage,
        qualifications: data.qualifications,
      },
    });
    return newProfile;
  }
};


export const tutorService = {
  alltutors,
  getTutorById,
  tutorCategory,
  createCategory,
  updateTutorProfile,
  availableStatus,
  createTutorProfile
};
