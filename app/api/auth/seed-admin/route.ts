import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";

async function seedAdmin() {
  await connectDB();

  const adminEmail = "admin@lawpilot.ai";
  let adminUser = await UserModel.findOne({ email: adminEmail });

  if (!adminUser) {
    const passwordHash = await bcrypt.hash("AdminPassword@2026", 10);
    adminUser = await UserModel.create({
      name: "LawPilot Super Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
      designation: "Chief Compliance Officer & Super Admin",
      organization: "LawPilot Enterprise AI",
      retentionDays: 30,
      autoOcr: true,
      aiProviderPreference: "gemini",
    });
  }

  return {
    success: true,
    message: "Super Admin account seeded successfully into MongoDB!",
    credentials: {
      email: "admin@lawpilot.ai",
      password: "AdminPassword@2026",
      role: "admin",
    },
  };
}

export async function GET() {
  try {
    const res = await seedAdmin();
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Admin seeding failed" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const res = await seedAdmin();
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Admin seeding failed" }, { status: 500 });
  }
}
