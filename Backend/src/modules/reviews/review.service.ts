import { prisma } from "../../../lib/pisma";

const createReview = async (
  bookingId: string,
  studentId: string,
  tutorId: string,
  rating: string,
  comment?: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.studentId !== studentId) {
    throw new Error("Only the student who made the booking can submit a review");
  }

  if (booking.tutorId !== tutorId) {
    throw new Error("Tutor ID does not match the booking");
  }

  const review = await prisma.review.create({
    data: {
      studentId,
      tutorId,
      rating,
      comment: comment || "",
    },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  return review;
};

const getReviewsByTutor = async (tutorId: string) => {
  const reviews = await prisma.review.findMany({
    where: { tutorId },
    include: {
      student: true,
    },
  });

  return reviews;
};

const getReviewsByStudent = async (studentId: string) => {
  const reviews = await prisma.review.findMany({
    where: { studentId },
    include: {
      tutor: true,
    },
  });

  return reviews;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      student: true,
      tutor: true,
    },
  });

  return reviews;
};

const getReviewById = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      student: true,
      tutor: true,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

export const reviewService = {
  createReview,
  getReviewsByTutor,
  getReviewsByStudent,
  getAllReviews,
  getReviewById,
};
