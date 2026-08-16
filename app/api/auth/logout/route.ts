import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out successfully! All session tokens cleared.",
  });

  // Clear HTTP-Only authentication cookie
  res.cookies.set("lawpilot_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  return res;
}
