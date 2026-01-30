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

export default bookSession;

export const bookingController = {
  bookSession,
  updateBooking,
};
