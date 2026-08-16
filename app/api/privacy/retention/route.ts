import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { retentionDays, autoOcr } = await req.json();

    await connectDB();

    await UserModel.findByIdAndUpdate(user.userId, {
      $set: { retentionDays, autoOcr },
    });

    return NextResponse.json({ success: true, retentionDays, autoOcr });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update retention preferences" }, { status: 500 });
  }
}
