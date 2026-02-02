import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { sendSuccess, sendError } from "../../utils/ApiError";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, search } = req.query;
    const filters: { role?: string; search?: string } = {};
    if (typeof role === "string") filters.role = role;
    if (typeof search === "string") filters.search = search;

    const users = await adminService.getAllUsers(filters);
    return sendSuccess(res, users, "Users retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const updatedUser = await adminService.updateUserStatus(id, updateData);
    return sendSuccess(res, updatedUser, "User updated successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await adminService.deleteUser(id);
    return sendSuccess(res, result, "User deleted successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, tutorId, studentId } = req.query;
    const filters: { status?: string; tutorId?: string; studentId?: string } = {};
    if (typeof status === "string") filters.status = status;
    if (typeof tutorId === "string") filters.tutorId = tutorId;
    if (typeof studentId === "string") filters.studentId = studentId;

    const bookings = await adminService.getAllBookings(filters);
    return sendSuccess(res, bookings, "Bookings retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    return sendSuccess(res, stats, "Dashboard stats retrieved successfully");
  } catch (error) {
    return sendError(res, error);
  }
};

export const adminController = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  getDashboardStats,
};
