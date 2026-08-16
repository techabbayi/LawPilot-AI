import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { ChatSessionModel } from "@/lib/db/models/ChatSession";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    let sessions = await ChatSessionModel.find({ userId: user.userId }).sort({ updatedAt: -1 }).lean();

    if (sessions.length === 0) {
      const defaultSession = await ChatSessionModel.create({
        userId: user.userId,
        title: "AI Legal Consultation",
        messages: [],
      });
      sessions = [defaultSession.toObject() as any];
    }

    return NextResponse.json({ success: true, sessions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch chat sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title = "New Legal Consultation", attachedDocId, attachedDocTitle } = await req.json();

    await connectDB();

    const session = await ChatSessionModel.create({
      userId: user.userId,
      title,
      attachedDocId,
      attachedDocTitle,
      messages: [],
    });

    return NextResponse.json({ success: true, session });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create chat session" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("id");

  await connectDB();

  try {
    if (sessionId && sessionId.match(/^[0-9a-fA-F]{24}$/)) {
      await ChatSessionModel.deleteOne({ _id: sessionId, userId: user.userId });
    } else {
      await ChatSessionModel.deleteMany({ userId: user.userId });
    }
    return NextResponse.json({ success: true, message: "Chat session history cleared from MongoDB" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to clear chat sessions" }, { status: 500 });
  }
}
