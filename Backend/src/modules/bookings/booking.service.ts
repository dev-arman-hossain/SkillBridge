import { prisma } from "../../../lib/prisma";

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
  const dayOfWeek = sessionDateTime.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" });

  console.log(`Booking request - sessionDate: ${sessionDateTime.toISOString()}, dayOfWeek: ${dayOfWeek}`);

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

  // Extract time components for comparison (compare only hours and minutes, not dates)
  const sessionHours = sessionDateTime.getUTCHours();
  const sessionMinutes = sessionDateTime.getUTCMinutes();
  const sessionTimeInMinutes = sessionHours * 60 + sessionMinutes;

  const availStartHours = tutorAvailability.startTime.getUTCHours();
  const availStartMinutes = tutorAvailability.startTime.getUTCMinutes();
  const availStartInMinutes = availStartHours * 60 + availStartMinutes;

  const availEndHours = tutorAvailability.endTime.getUTCHours();
  const availEndMinutes = tutorAvailability.endTime.getUTCMinutes();
  const availEndInMinutes = availEndHours * 60 + availEndMinutes;

  console.log(`Time check - session: ${sessionHours}:${sessionMinutes} (${sessionTimeInMinutes}min), available: ${availStartHours}:${availStartMinutes}-${availEndHours}:${availEndMinutes} (${availStartInMinutes}-${availEndInMinutes}min)`);

  if (sessionTimeInMinutes < availStartInMinutes || sessionTimeInMinutes > availEndInMinutes) {
    const formatTime = (h: number, m: number) => {
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
    };
    throw new Error(
      `Session time must be between ${formatTime(availStartHours, availStartMinutes)} and ${formatTime(availEndHours, availEndMinutes)}`
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

const getUserBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { studentId: userId },
        { tutor: { userId: userId } }
      ]
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    },
    orderBy: {
      sessionDate: 'desc'
    }
  });

  return bookings;
};

const getBookingById = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          categories: true
        }
      }
    }
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

export const bookingService = {
  createBooking,
  updateBookingStatus,
  getUserBookings,
  getBookingById,
};