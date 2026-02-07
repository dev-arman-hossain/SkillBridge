// User and Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "STUDENT" | "TUTOR" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// Tutor Types
export interface TutorProfile {
  id: string;
  userId: string;
  biography: string;
  profileImage: string;
  qualifications: string;
  user?: User;
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Tutor extends User {
  tutorProfile?: TutorProfile;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Availability Types
export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  tutor?: TutorProfile;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export type BookingStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  sessionDate: string;
  sessionLink: string;
  status: BookingStatus;
  student?: User;
  tutor?: TutorProfile;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  studentId: string;
  tutorId: string;
  sessionDate: string;
  sessionLink?: string;
}

// Review Types
export interface Review {
  id: string;
  studentId: string;
  tutorId: string;
  rating: string;
  comment: string;
  reviewDate?: string;
  student?: User;
  tutor?: TutorProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewData {
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: string;
  comment?: string;
}

// Admin Types
export interface UpdateUserData {
  role?: "USER" | "STUDENT" | "TUTOR" | "ADMIN";
  emailVerified?: boolean;
  name?: string;
  email?: string;
}

export interface UserWithProfile extends User {
  emailVerified: boolean;
  image?: string;
  tutorProfile?: {
    id: string;
    biography: string;
    profileImage?: string;
    qualifications: string;
    categories: Array<{
      id: string;
      name: string;
    }>;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message: string;
  error?: string;
  count?: number;
}
