import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debug: Log the request
  console.log("Middleware running for:", pathname);

  // Get token from cookies
  const token = req.cookies.get("token")?.value;
  console.log("Token found:", !!token);

  // Handle login page
  if (pathname.startsWith("/login")) {
    console.log("Login page accessed");
    if (token) {
      console.log("User has token, redirecting to profile");
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    console.log("No token, allowing access to login");
    return NextResponse.next();
  }

  // Handle protected routes
  const protectedRoutes = ["/profile", "/accounts"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    console.log("Protected route accessed:", pathname);
    if (!token) {
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log("Token found, allowing access");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/profile", "/accounts"],
};
