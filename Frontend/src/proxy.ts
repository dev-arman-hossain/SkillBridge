import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userService } from "./services/userService";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let isAuthenticated = false;
  let userRole: string | null = null;

  try {
    const { data } = await userService.getSession();

    if (data && data.user) {
      isAuthenticated = true;
      userRole = (data.user as any).role || "USER";
    }
  } catch (error) {
    console.error("Proxy auth error:", error);
    // If session check fails, treat as unauthenticated
  }

  //* User is not authenticated
  if (!isAuthenticated) {
    // Only redirect to login if trying to access protected routes
    if (
      pathname.startsWith("/student-dashboard") ||
      pathname.startsWith("/tutor-dashboard") ||
      pathname.startsWith("/admin-dashboard") ||
      pathname.startsWith("/select-role")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  //* Role-based routing for authenticated users
  switch (userRole) {
    case "ADMIN":
      // Admin trying to access other dashboards
      if (
        pathname.startsWith("/student-dashboard") ||
        pathname.startsWith("/tutor-dashboard")
      ) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }
      // Admin trying to select role (already has one)
      if (pathname.startsWith("/select-role")) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }
      break;

    case "TUTOR":
      // Tutor trying to access other dashboards
      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/student-dashboard")
      ) {
        return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
      }
      // Tutor trying to select role (already has one)
      if (pathname.startsWith("/select-role")) {
        return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
      }
      break;

    case "STUDENT":
      // Student trying to access other dashboards
      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/tutor-dashboard")
      ) {
        return NextResponse.redirect(new URL("/student-dashboard", request.url));
      }
      // Student trying to select role (already has one)
      if (pathname.startsWith("/select-role")) {
        return NextResponse.redirect(new URL("/student-dashboard", request.url));
      }
      break;

    case "USER":
      // Regular users trying to access specialized dashboards
      // Redirect them to select role page
      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/tutor-dashboard") ||
        pathname.startsWith("/student-dashboard")
      ) {
        return NextResponse.redirect(new URL("/select-role", request.url));
      }
      break;

    default:
      // Unknown role - redirect to login for dashboard access
      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/tutor-dashboard") ||
        pathname.startsWith("/student-dashboard")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student-dashboard/:path*",
    "/tutor-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/select-role",
  ],
};
