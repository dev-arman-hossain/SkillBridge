import {
  Tutor,
  Category,
  Availability,
  Booking,
  Review,
  CreateBookingData,
  CreateReviewData,
  ApiResponse,
  TutorProfile,
  UserWithProfile,
  UpdateUserData,
} from "../../types";

const API_BASE_URL = "/api";


export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.message || data?.error || "Request failed";
      throw new ApiError(message, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

export const tutorApi = {
  // Get all tutors with optional filters
  getAllTutors: (filters?: { category?: string; search?: string; minRating?: number }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.minRating) params.append("minRating", filters.minRating.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<ApiResponse<Tutor[]>>(`/tutors${query}`);
  },

  // Get tutor by ID
  getTutorById: (id: string) =>
    apiRequest<ApiResponse<Tutor>>(`/tutors/${id}`),

  // Get categories
  getCategories: () =>
    apiRequest<ApiResponse<Category[]>>("/categories"),

  // Create category (Admin)
  createCategory: (data: { name: string; description?: string }) =>
    apiRequest<ApiResponse<Category>>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update category (Admin)
  updateCategory: (id: string, data: { name?: string; description?: string }) =>
    apiRequest<ApiResponse<Category>>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Delete category (Admin)
  deleteCategory: (id: string) =>
    apiRequest<ApiResponse<{ message: string }>>(`/categories/${id}`, {
      method: "DELETE",
    }),

  // Create/Update tutor profile
  createTutorProfile: (data: {
    userId: string;
    biography?: string;
    profileImage?: string;
    qualifications?: string;
    categoryIds?: string[];
  }) =>
    apiRequest<ApiResponse<TutorProfile>>("/tutor/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Update tutor profile
  updateTutorProfile: (
    id: string,
    data: {
      biography?: string;
      profileImage?: string;
      qualifications?: string;
      categoryIds?: string[];
    }
  ) =>
    apiRequest<ApiResponse<TutorProfile>>(`/tutors/profile/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Get availability
  getAvailability: (params?: { availabilityId?: string; tutorId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.availabilityId) queryParams.append("availabilityId", params.availabilityId);
    if (params?.tutorId) queryParams.append("tutorId", params.tutorId);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return apiRequest<ApiResponse<Availability[]>>(`/tutor/availability${query}`);
  },

  // Create/Update availability
  createAvailability: (data: {
    tutorId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }) =>
    apiRequest<ApiResponse<Availability>>("/tutor/availability", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete availability
  deleteAvailability: (id: string) =>
    apiRequest<ApiResponse<{ message: string }>>(`/tutor/availability/${id}`, {
      method: "DELETE",
    }),
};

// User API
export const userApi = {
  // Get current user profile
  getMe: () =>
    apiRequest<ApiResponse<UserWithProfile>>("/users/me"),

  // Update current user profile
  updateProfile: (data: { name?: string; image?: string }) =>
    apiRequest<ApiResponse<UserWithProfile>>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Update user role
  updateRole: (role: string) =>
    apiRequest<ApiResponse<UserWithProfile>>("/users/me/role", {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  // Get dashboard stats
  getDashboardStats: () =>
    apiRequest<ApiResponse<any>>("/users/me/stats"),

  // Get user by ID
  getUserById: (id: string) =>
    apiRequest<ApiResponse<UserWithProfile>>(`/users/${id}`),
};

// Booking API
export const bookingApi = {
  // Create booking
  createBooking: (data: CreateBookingData) =>
    apiRequest<{ message: string; booking: Booking }>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get user's bookings (student or tutor)
  getUserBookings: (userId: string) =>
    apiRequest<ApiResponse<Booking[]>>(`/bookings?userId=${userId}`),

  // Get booking by ID
  getBookingById: (id: string) =>
    apiRequest<ApiResponse<Booking>>(`/bookings/${id}`),

  // Update booking status
  updateBookingStatus: (id: string, status: "PENDING" | "COMPLETED" | "CANCELLED") =>
    apiRequest<{ message: string; booking: Booking }>(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Review API
export const reviewApi = {
  // Create review
  createReview: (data: CreateReviewData) =>
    apiRequest<{ message: string; review: Review }>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get all reviews
  getAllReviews: () =>
    apiRequest<ApiResponse<Review[]>>("/reviews"),

  // Get review by ID
  getReviewById: (id: string) =>
    apiRequest<ApiResponse<Review>>(`/reviews/${id}`),

  // Get tutor reviews
  getTutorReviews: (tutorId: string) =>
    apiRequest<ApiResponse<Review[]>>(`/reviews/tutor/${tutorId}`),

  // Get student reviews
  getStudentReviews: (studentId: string) =>
    apiRequest<ApiResponse<Review[]>>(`/reviews/student/${studentId}`),
};

// Admin API
export const adminApi = {
  // Get dashboard stats
  getDashboardStats: () =>
    apiRequest<ApiResponse<any>>("/admin/stats"),

  // Get all users
  getAllUsers: (filters?: { role?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    if (filters?.search) params.append("search", filters.search);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<ApiResponse<UserWithProfile[]>>(`/admin/users${query}`);
  },

  // Update user
  updateUser: (id: string, data: UpdateUserData) =>
    apiRequest<ApiResponse<UserWithProfile>>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Delete user
  deleteUser: (id: string) =>
    apiRequest<ApiResponse<{ message: string }>>(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  // Get all bookings
  getAllBookings: (filters?: { status?: string; tutorId?: string; studentId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.tutorId) params.append("tutorId", filters.tutorId);
    if (filters?.studentId) params.append("studentId", filters.studentId);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<ApiResponse<Booking[]>>(`/admin/bookings${query}`);
  },
};
