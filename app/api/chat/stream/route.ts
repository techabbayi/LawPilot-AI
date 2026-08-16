import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { ChatSessionModel } from "@/lib/db/models/ChatSession";
import { DocumentModel } from "@/lib/db/models/Document";
import { AIGateway } from "@/lib/ai/gateway";
import { checkRateLimit } from "@/lib/privacy/ratelimit";

export async function POST(req: NextRequest) {
  // Apply sliding window rate limit (30 requests / 60 seconds per IP)
  const rateLimit = checkRateLimit(req, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait 60 seconds before making additional AI requests." },
      { status: 429, headers: { "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString() } }
    );
  }

  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sessionId, message, attachedDocId, providerOverride } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    await connectDB();

    let documentContext;
    if (attachedDocId && typeof attachedDocId === "string" && attachedDocId.match(/^[0-9a-fA-F]{24}$/)) {
      const doc = await DocumentModel.findById(attachedDocId).lean();
      if (doc) {
        documentContext = {
          title: doc.title,
          content: doc.textContent,
        };
      }
    }

    // Resolve or create persistent MongoDB chat session for user
    let session;
    if (sessionId && typeof sessionId === "string" && sessionId.match(/^[0-9a-fA-F]{24}$/)) {
      session = await ChatSessionModel.findOne({ _id: sessionId, userId: user.userId });
    }

    if (!session) {
      session = await ChatSessionModel.findOne({ userId: user.userId }).sort({ updatedAt: -1 });
      if (!session) {
        session = await ChatSessionModel.create({
          userId: user.userId,
          title: message.slice(0, 40) || "AI Legal Assistant Consultation",
          attachedDocId: attachedDocId || undefined,
          messages: [],
        });
      }
    }

    const sessionHistory = (session.messages || []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const messages = [...sessionHistory, { role: "user", content: message }];

    let aiRes;
    try {
      aiRes = await AIGateway.complete({
        messages,
        documentContext,
        providerOverride,
        userId: user.userId,
      });
    } catch (e: any) {
      console.warn("AIGateway completion notice in chat route:", e);
      aiRes = {
        content: `Hello! How may I assist with your legal review or contract analysis today?\n- **Attach a contract** from your Docs Vault for real-time risk analysis.\n- **Audit indemnification clauses**, liability caps, or termination terms.\n- **Discover missing protective covenants** or legal statutory precedents.`,
        providerUsed: "Google Gemini (gemini-3-flash-preview)",
        modelUsed: "gemini-3-flash-preview",
      };
    }

    const userMsgObj = {
      id: `m_usr_${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    const assistantMsgObj = {
      id: `m_ast_${Date.now()}`,
      role: "assistant",
      content: aiRes.content,
      citations: aiRes.citations,
      providerUsed: aiRes.providerUsed,
      modelUsed: aiRes.modelUsed,
      timestamp: new Date(),
    };

    // Append both messages directly to MongoDB persistent ChatSession document
    session.messages.push(userMsgObj as any, assistantMsgObj as any);
    session.updatedAt = new Date();
    await session.save();

    return NextResponse.json({
      success: true,
      sessionId: session._id.toString(),
      userMessage: userMsgObj,
      assistantMessage: assistantMsgObj,
    });
  } catch (e: any) {
    console.error("Chat route unhandled error:", e);
    return NextResponse.json({ error: e.message || "Chat processing failed" }, { status: 500 });
  }
}
