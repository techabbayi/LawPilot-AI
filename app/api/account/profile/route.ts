import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";

export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const dbUser = await UserModel.findById(authUser.userId).select("-passwordHash").lean();
    if (!dbUser) {
      return NextResponse.json({
        user: {
          _id: authUser.userId,
          name: authUser.name || "",
          email: authUser.email || "",
          designation: "",
          organization: "",
          websiteUrl: "",
          role: authUser.role || "user",
          retentionDays: 30,
          autoOcr: true,
          aiProviderPreference: "gemini",
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ user: dbUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const { name, designation, organization, websiteUrl, retentionDays, autoOcr, aiProviderPreference } = await req.json();

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (designation !== undefined) updateFields.designation = designation.trim();
    if (organization !== undefined) updateFields.organization = organization.trim();
    if (websiteUrl !== undefined) updateFields.websiteUrl = websiteUrl.trim();
    if (retentionDays !== undefined) updateFields.retentionDays = Number(retentionDays);
    if (autoOcr !== undefined) updateFields.autoOcr = Boolean(autoOcr);
    if (aiProviderPreference !== undefined) updateFields.aiProviderPreference = aiProviderPreference;

    const updatedUser = await UserModel.findByIdAndUpdate(authUser.userId, { $set: updateFields }, { new: true })
      .select("-passwordHash")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update profile" }, { status: 500 });
  }
}
