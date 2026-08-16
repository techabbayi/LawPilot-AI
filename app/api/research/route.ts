import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { AIGateway } from "@/lib/ai/gateway";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { topic } = await req.json();
    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "Research topic is required" }, { status: 400 });
    }

    await connectDB();
    const userDocs = await DocumentModel.find({ userId: user.userId, isDeleted: false }).limit(3).lean();
    let docContextStr = userDocs.map((d) => `Document "${d.title}": ${d.textContent.slice(0, 1000)}`).join("\n\n");

    const systemPrompt = `You are AI Legal Research Engine, an elite legal intelligence assistant specializing in statutory frameworks, case law precedents, UCC rules, and contract clause drafting.
Analyze the user's research topic or legal query carefully.

You MUST respond with a JSON object strictly matching this schema:
{
  "topic": "Title of the research topic",
  "statute": "Applicable statutory framework, code section, or case precedent (e.g. DGCL § 145 / UCC § 2-719 / Restatement (Second) of Contracts)",
  "summary": "Clear, detailed statutory legal analysis explaining enforceability, judicial standards, exceptions, and key legal rules.",
  "recommendedClause": "A complete, professionally drafted standard legal clause addressing this topic according to contract best practices.",
  "riskAssessment": "Risk level (either 'low', 'medium', 'high', or 'critical') with actionable advice on legal pitfalls.",
  "keyPrecedents": ["List of 2-3 notable legal precedents or judicial doctrines"]
}

Return ONLY valid JSON. No surrounding markdown formatting or text.`;

    const aiRes = await AIGateway.complete({
      systemPrompt,
      messages: [
        {
          role: "user",
          content: `Perform in-depth legal research on topic: "${topic}".\nContext from user's uploaded legal documents:\n${docContextStr || "No uploaded documents available."}`,
        },
      ],
      temperature: 0.2,
    });

    let result;
    try {
      const cleanJson = aiRes.content.replace(/```json/gi, "").replace(/```/g, "").trim();
      result = JSON.parse(cleanJson);
    } catch (e) {
      result = {
        topic: topic,
        statute: "General Commercial Law / Uniform Commercial Code",
        summary: aiRes.content,
        recommendedClause: `The parties agree to comply with all applicable statutory rules and industry standards regarding ${topic}.`,
        riskAssessment: "medium",
        keyPrecedents: ["Standard Judicial Construction", "Uniform Commercial Code Guidelines"],
      };
    }

    return NextResponse.json({ result, providerUsed: aiRes.providerUsed });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Legal research failed" }, { status: 500 });
  }
}
