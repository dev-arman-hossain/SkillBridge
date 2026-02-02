export class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

export const sendSuccess = (res: any, data: any, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: any, error: any) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error("Unexpected error:", error);
  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
