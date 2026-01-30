import { prisma } from "../../../lib/pisma";

const createBooking = async (studentId: string, tutorId: string, sessionDate: Date, sessionLink?: string) => {
  let tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorId },
  });

  if (!tutorProfile) {
    tutorProfile = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });
  }

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const sessionDateTime = new Date(sessionDate);
  const dayOfWeek = sessionDateTime.toLocaleString("en-US", { weekday: "long" });

  console.log(`Booking request - sessionDate: ${sessionDateTime}, dayOfWeek: ${dayOfWeek}`);

  const tutorAvailability = await prisma.availability.findFirst({
    where: {
      tutorId: tutorProfile.id,
      dayOfWeek: dayOfWeek,
    },
  });

  if (!tutorAvailability) {
    throw new Error(
      `Tutor is not available on ${dayOfWeek}. Available days: Check tutor schedule.`
    );
  }

  if (
    sessionDateTime < tutorAvailability.startTime ||
    sessionDateTime > tutorAvailability.endTime
  ) {
    throw new Error(
      `Session time must be between ${tutorAvailability.startTime.toISOString()} and ${tutorAvailability.endTime.toISOString()}`
    );
  }

  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorId: tutorProfile.id,
      sessionDate: sessionDateTime,
      sessionLink: sessionLink ?? "",
      status: "PENDING",
    },
  });

  return booking;
};

const updateBookingStatus = async (bookingId: string, status: "PENDING" | "COMPLETED" | "CANCELLED") => {
  const validStatuses = ["PENDING", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return updatedBooking;
};

export const bookingService = {
  createBooking,
  updateBookingStatus,
};