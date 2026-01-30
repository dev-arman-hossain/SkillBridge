import { betterAuth } from "better-auth";
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

const authInstance = betterAuth({});

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await authInstance.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res
          .status(403)
          .json({ message: "Please verify your email to access" });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role || "USER",
        emailVerified: session.user.emailVerified,
      };
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default auth;
