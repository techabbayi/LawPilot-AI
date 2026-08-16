import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { sendPasswordResetEmail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    await connectDB();

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    
    // Generates crypto 64-character token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 Hour Expiry

    if (user) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();
    }

    // Dispatch email
    const mailResult = await sendPasswordResetEmail(email, resetToken, user?.name);

    return NextResponse.json({
      success: true,
      message: "Password reset authorization link has been generated and dispatched to your email address.",
      resetToken,
      resetLink: mailResult.resetLink,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to process forgot password request" }, { status: 500 });
  }
}
