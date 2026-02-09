import { auth as authInstance } from "../../lib/auth";
import type { NextFunction, Request, Response } from "express";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  TUTOR = "TUTOR",
  STUDENT = "STUDENT",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await authInstance.api.getSession({
        headers: req.headers as HeadersInit,
      });

      console.log("Auth Middleware - Path:", req.path);
      console.log("Auth Middleware - Headers origin:", req.headers.origin);
      console.log("Auth Middleware - Session:", session ? "Found" : "Not Found");

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // if (!session.user.emailVerified) {
      //   console.log("Auth Middleware - Blocked: Email not verified");
      //   return res
      //     .status(403)
      //     .json({ message: "Please verify your email to access" });
      // }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role || "USER",
        emailVerified: session.user.emailVerified,
      };

      console.log("Auth Middleware - User:", session);

      console.log("Auth Middleware - User Role:", req.user.role);
      console.log("Auth Middleware - Required Roles:", roles);

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        console.log("Auth Middleware - Blocked: Insufficient Role");
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default auth;
