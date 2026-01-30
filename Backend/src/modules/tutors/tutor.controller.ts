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
    
    const {name, description} = data;
    if(!name || !description){
      return res.status(400).json({
        success: false,
        message: "name and description are required",
      });
    }


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

const availableStatus = async (req: Request, res: Response) => {
  try {
    const availabilityStatus = await tutorService.availableStatus(req.body);
    return res.status(201).json({
      success: true,
      message: "session created successfully",
      data: availabilityStatus,
    });

  } catch (error: any) {
    console.error("session creation error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Session creation failed",
    });
  }
};


const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const createProfile = await tutorService.createTutorProfile(data);
    res.status(200).json({
      data: createProfile,
      success: true,
      message: "tuition profile updated",
    });
  } catch (error: any) {
    res.send(error.message);
  }
};

export const tutorController = {
  getAllTutors,
  getTutorById,
  tutorCategory,
  createCategory,
  updateTutorProfile,
  availableStatus,
  createTutorProfile
};
