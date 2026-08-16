import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AIFeedbackModel } from "@/lib/db/models/AIFeedback";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { messageId, query, responseSnippet, rating } = await req.json();

    if (!messageId || !rating) {
      return NextResponse.json({ error: "messageId and rating are required" }, { status: 400 });
    }

    await connectDB();

    await AIFeedbackModel.findOneAndUpdate(
      { userId: user.userId, messageId },
      { query: query || "", responseSnippet: (responseSnippet || "").slice(0, 300), rating },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Feedback recorded (${rating}). Personalized preference matrix updated!`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Feedback save failed" }, { status: 500 });
  }
}
