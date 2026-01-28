import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await tutorService.alltutors(req, res);
    res.status(200).json({
      data: tutors,
      success: true,
      message: "Tutors retrieved successfully",
    });
  } catch (error: any) {
    res.send(error.message);
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tutors = await tutorService.getTutorById(id as string);
    res.status(200).json({
      data: tutors,
      success: true,
      message: "Tutors single successfully",
    });
  } catch (error: any) {
    res.send(error.message);
  }
};

const tutorCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("category data", data);
    const tutorCategory = await tutorService.tutorCategory();
    res.status(200).json({
      data: tutorCategory,
      success: true,
      message: "tuition category",
    });
  } catch (error: any) {
    res.send(error.message);
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("category data", data);
    const tutorCategory = await tutorService.createCategory(data);
    res.status(200).json({
      data: tutorCategory,
      success: true,
      message: "tuition category",
    });
  } catch (error: any) {
    res.send(error.message);
  }
};

const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    const tutorData = await tutorService.updateTutorProfile(
      id as string,
      profileData,
    );
    res.status(200).json(tutorData);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: "profile update failed",
      details: e,
    });
  }
};

export const tutorController = {
  getAllTutors,
  getTutorById,
  tutorCategory,
  createCategory,
  updateTutorProfile,
};
