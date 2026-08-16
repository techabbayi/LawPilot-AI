import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { hasPermission } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || !hasPermission(user.role, "admin")) {
    return NextResponse.json({ error: "Forbidden: Admin privilege required" }, { status: 403 });
  }

  await connectDB();

  try {
    const users = await UserModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || !hasPermission(user.role, "admin")) {
    return NextResponse.json({ error: "Forbidden: Admin privilege required" }, { status: 403 });
  }

  try {
    const { targetUserId, newRole } = await req.json();
    await connectDB();

    await UserModel.findByIdAndUpdate(targetUserId, { role: newRole });
    return NextResponse.json({ success: true, targetUserId, newRole });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update role" }, { status: 500 });
  }
}
