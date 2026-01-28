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

const updateTutorProfile = async (id: string, profileData:{biography?: string, profileImage?: string, qualifications?: string}) => {
  const tutorData = await prisma.user.findUniqueOrThrow({
   where: {
      id: id,
    },
  });

  const updatedTutorProfile = await prisma.tutorProfile.update({
    where:{
      userId: id,
    },
    data:{
      biography: profileData.biography as string,
      profileImage: profileData.profileImage as string,
      qualifications: profileData.qualifications as string
    },
    include:{
      user: true,
    }
  });

  return updatedTutorProfile;
};

export const tutorService = {
  alltutors,
  getTutorById,
  tutorCategory,
  createCategory,
  updateTutorProfile
};
