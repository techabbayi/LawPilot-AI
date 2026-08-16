import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("lawpilot_token")?.value;
  const { pathname } = req.nextUrl;

  // Redirect legacy /vault route to /docs studio
  if (pathname === "/vault" || pathname.startsWith("/vault/")) {
    return NextResponse.redirect(new URL("/docs", req.url));
  }

  // All Sidebar Workspace Pages (MUST BE AUTHENTICATED)
  const protectedRoutes = [
    "/dashboard",
    "/assistant",
    "/analyzer",
    "/comparator",
    "/docs",
    "/generator",
    "/research",
    "/account",
    "/privacy",
    "/settings",
    "/analytics",
    "/admin",
  ];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // If unauthenticated user tries to access ANY protected workspace page, redirect to /login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Super Admin Enforcement: Super Admin accounts can ONLY access /admin routes & /support/status
  if (token && isProtected && !pathname.startsWith("/admin") && !pathname.startsWith("/support/status")) {
    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decodedJson = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
        if (decodedJson.role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      }
    } catch (e) {
      // ignore token parse errors
    }
  }

  // Admin Route Guard (Non-admin users trying to access /admin get redirected to /dashboard)
  if (pathname.startsWith("/admin") && token) {
    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decodedJson = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
        if (decodedJson.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  const response = NextResponse.next();

  // Security Headers Hardening
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/assistant/:path*",
    "/analyzer/:path*",
    "/comparator/:path*",
    "/vault/:path*",
    "/docs/:path*",
    "/generator/:path*",
    "/research/:path*",
    "/account/:path*",
    "/privacy/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/admin/:path*",
  ],
};
