// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/verifyToken";

const PROTECTED_PREFIXES = ["/profile", "/accounts", "/posts"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // 1) Allow /login logic first (fast path)
  if (pathname.startsWith("/login")) {
    if (!token) return NextResponse.next();

    // Optional: verify token before redirecting to /profile
    const verified = await verifyToken(token);
    if (verified) {
      return NextResponse.redirect(new URL("/profile", req.url));
    } else {
      // stale token on login page: clear it and stay on login
      const res = NextResponse.next();
      res.cookies.delete("token");
      return res;
    }
  }

  // 2) For protected routes, enforce auth
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const verified = await verifyToken(token);
    if (!verified) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // 3) Everything else passes through
  return NextResponse.next();
}

export const config = {
  // Covers subpaths like /profile/edit, /accounts/123, /posts/new + login page
  matcher: ["/login", "/(profile|accounts|posts)(.*)"],
};
