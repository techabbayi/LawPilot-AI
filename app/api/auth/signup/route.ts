import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { signJWT } from "@/lib/auth/jwt";
import { sendWelcomeEmail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    await connectDB();

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Account with this email already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      retentionDays: 30,
      autoOcr: true,
      aiProviderPreference: "gemini",
    });

    // Send Welcome Email
    try {
      await sendWelcomeEmail(newUser.email, newUser.name);
    } catch (mailErr) {
      console.error("Welcome email dispatch failed:", mailErr);
    }

    const payload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = signJWT(payload);
    const res = NextResponse.json({ success: true, user: payload, token });
    res.cookies.set("lawpilot_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Registration failed" }, { status: 500 });
  }
}
