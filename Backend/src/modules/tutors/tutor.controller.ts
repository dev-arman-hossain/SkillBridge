import { Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { sendSuccess, sendError } from "../../utils/ApiError";

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const { category, search, minRating } = req.query;
    const filters: { category?: string; search?: string; minRating?: number } = {};
    if (typeof category === "string") filters.category = category;
    if (typeof search === "string") filters.search = search;
    if (typeof minRating === "string") filters.minRating = parseFloat(minRating);

    const tutors = await tutorService.alltutors(filters);
    return sendSuccess(res, tutors, "Tutors retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const tutor = await tutorService.getTutorById(id);
    return sendSuccess(res, tutor, "Tutor retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const tutorCategory = async (_req: Request, res: Response) => {
  try {
    const categories = await tutorService.tutorCategory();
    return sendSuccess(res, categories, "Categories retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    const category = await tutorService.createCategory({ name, description });
    return sendSuccess(res, category, "Category created successfully", 201);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const category = await tutorService.updateCategory(id, data);
    return sendSuccess(res, category, "Category updated successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await tutorService.deleteCategory(id);
    return sendSuccess(res, result, "Category deleted successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const profileData = req.body;
    const tutorData = await tutorService.updateTutorProfile(id, profileData);
    return sendSuccess(res, tutorData, "Profile updated successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const availableStatus = async (req: Request, res: Response) => {
  try {
    const availability = await tutorService.availableStatus(req.body);
    return sendSuccess(res, availability, "Availability set successfully", 201);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await tutorService.deleteAvailability(id);
    return sendSuccess(res, result, "Availability deleted successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }
    const profile = await tutorService.createTutorProfile(data);
    return sendSuccess(res, profile, "Tutor profile created successfully", 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const tutorController = {
  getAllTutors,
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
