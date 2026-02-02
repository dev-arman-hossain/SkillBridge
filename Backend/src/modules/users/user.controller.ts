import { Request, Response } from "express";
import { userService } from "./user.service";
import { sendSuccess, sendError } from "../../utils/ApiError";

const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userService.getUserById(req.user.id);
    return sendSuccess(res, user, "User retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await userService.getUserById(id);
    return sendSuccess(res, user, "User retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, image } = req.body;
    const user = await userService.updateUserProfile(req.user.id, { name, image });
    return sendSuccess(res, user, "Profile updated successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { role } = req.body;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const user = await userService.updateUserRole(req.user.id, role);
    return sendSuccess(res, user, "Role updated successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const stats = await userService.getDashboardStats(req.user.id);
    return sendSuccess(res, stats, "Dashboard stats retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

export const userController = {
  getMe,
  getUserById,
  updateProfile,
  updateRole,
  getDashboardStats,
};
