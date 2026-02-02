import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const bookSession = async (req: Request, res: Response) => {
  try {
    const { studentId, tutorId, sessionDate, sessionLink } = req.body;

    const booking = await bookingService.createBooking(
      studentId,
      tutorId,
      new Date(sessionDate),
      sessionLink,
    );

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedBooking = await bookingService.updateBookingStatus(id, status);

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const bookings = await bookingService.getUserBookings(userId as string);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const booking = await bookingService.getBookingById(id);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

export default bookSession;

export const bookingController = {
  bookSession,
  updateBooking,
  getUserBookings,
  getBookingById,
};
