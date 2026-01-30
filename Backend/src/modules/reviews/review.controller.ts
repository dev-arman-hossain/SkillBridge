import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const { bookingId, studentId, tutorId, rating, comment } = req.body;

    if (!bookingId || !studentId || !tutorId || !rating) {
      return res.status(400).json({
        error: "bookingId, studentId, tutorId, and rating are required",
      });
    }

    const review = await reviewService.createReview(
      bookingId,
      studentId,
      tutorId,
      rating,
      comment
    );

    return res.status(201).json({
      message: "Review submitted successfully and booking marked as completed",
      review,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    const reviews = await reviewService.getReviewsByTutor(tutorId);

    return res.status(200).json({
      data: reviews,
      success: true,
      message: "Tutor reviews retrieved successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getStudentReviews = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const reviews = await reviewService.getReviewsByStudent(studentId);

    return res.status(200).json({
      data: reviews,
      success: true,
      message: "Student reviews retrieved successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getAllReviews();

    return res.status(200).json({
      data: reviews,
      success: true,
      message: "All reviews retrieved successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await reviewService.getReviewById(id);

    return res.status(200).json({
      data: review,
      success: true,
      message: "Review retrieved successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const reviewController = {
  createReview,
  getTutorReviews,
  getStudentReviews,
  getAllReviews,
  getReviewById,
};
