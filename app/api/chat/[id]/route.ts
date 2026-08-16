import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { ChatSessionModel } from "@/lib/db/models/ChatSession";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const session = await ChatSessionModel.findOne({ _id: id, userId: user.userId }).lean();
    return NextResponse.json({ session });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Chat session not found" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    await ChatSessionModel.deleteOne({ _id: id, userId: user.userId });
    return NextResponse.json({ success: true, message: "Chat history deleted permanently." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete chat session" }, { status: 500 });
  }
}
