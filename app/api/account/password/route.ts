import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All password fields are required" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New password and confirmation do not match" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
    }

    await connectDB();

    const user = await UserModel.findById(authUser.userId);

    if (user && user.passwordHash) {
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    // Hash the new password with salt rounds (10)
    const newHash = await bcrypt.hash(newPassword, 10);

    if (user) {
      user.passwordHash = newHash;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully! Please use your new credentials for future sign-ins.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Password update failed" }, { status: 500 });
  }
}
