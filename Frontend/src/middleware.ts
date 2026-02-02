import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`[Middleware] Processing request for: ${pathname}`);

  let isAuthenticated = false;
  let userRole: string | null = null;

  try {
   
    const cookieHeader = request.headers.get("cookie") || "";

   
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/auth/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();

      
      if (data && data.user && data.user.id) {
        isAuthenticated = true;
        userRole = data.user.role || "USER";
        console.log(`[Middleware] Authenticated user: ${data.user.email} with role: ${userRole}`);
      } else {
        console.log("[Middleware] No user found in session response");
      }
    } else {
      console.log(`[Middleware] Session check failed with status: ${res.status}`);
    }
  } catch (error) {
    console.error("[Middleware] Auth error:", error);
    
  }

  //* User is not authenticated
  if (!isAuthenticated) {
    console.log(`[Middleware] User not authenticated, redirecting to login`);
    
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

  console.log(`[Middleware] User authenticated with role: ${userRole}, allowing access to ${pathname}`);

  //* Role-based routing for authenticated users
  switch (userRole) {
    case "ADMIN":
     
      if (
        pathname.startsWith("/student-dashboard") ||
        pathname.startsWith("/tutor-dashboard")
      ) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }
     
      if (pathname.startsWith("/select-role")) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }
      break;

    case "TUTOR":

      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/student-dashboard")
      ) {
        return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
      }
     
      if (pathname.startsWith("/select-role")) {
        return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
      }
      break;

    case "STUDENT":
   
      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/tutor-dashboard")
      ) {
        return NextResponse.redirect(new URL("/student-dashboard", request.url));
      }
     
      if (pathname.startsWith("/select-role")) {
        return NextResponse.redirect(new URL("/student-dashboard", request.url));
      }
      break;

    case "USER":
      
      if (
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/tutor-dashboard") ||
        pathname.startsWith("/student-dashboard")
      ) {
        return NextResponse.redirect(new URL("/select-role", request.url));
      }
      break;

    default:
     
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
