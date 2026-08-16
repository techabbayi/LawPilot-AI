import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { AnalysisModel } from "@/lib/db/models/Analysis";
import { ChatSessionModel } from "@/lib/db/models/ChatSession";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import { UserModel } from "@/lib/db/models/User";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const docs = await DocumentModel.find({ isDeleted: false }).lean();
    const totalDocuments = docs.length;

    let processedPages = 0;
    let totalSizeBytes = 0;

    docs.forEach((doc: any) => {
      processedPages += doc.metadata?.pageCount || Math.ceil((doc.textContent?.length || 0) / 1800) || 1;
      totalSizeBytes += doc.sizeBytes || 0;
    });

    const analyses = await AnalysisModel.find({}).lean();
    let highRiskFlagsDetected = 0;
    let lowRiskCount = 0;
    let mediumRiskCount = 0;
    let highRiskCount = 0;
    let criticalRiskCount = 0;

    analyses.forEach((ans: any) => {
      const level = ans.overallRiskLevel || "low";
      if (level === "low") lowRiskCount++;
      else if (level === "medium") mediumRiskCount++;
      else if (level === "high") highRiskCount++;
      else if (level === "critical") criticalRiskCount++;

      (ans.detectedClauses || []).forEach((c: any) => {
        if (c.riskLevel === "high" || c.riskLevel === "critical") {
          highRiskFlagsDetected++;
        }
      });
    });

    const chatSessions = await ChatSessionModel.find({}).lean();
    let chatQueriesCount = 0;
    chatSessions.forEach((session: any) => {
      chatQueriesCount += (session.messages || []).length;
    });

    const activeUsers = await UserModel.countDocuments();
    const privacyHardWipesExecuted = await AuditLogModel.countDocuments({
      action: { $regex: /DELETE|PURGE|WIPE|CLEAR/i },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments,
        processedPages,
        aiQueriesExecuted: chatQueriesCount + analyses.length,
        highRiskFlagsDetected,
        storageUsedBytes: totalSizeBytes,
        activeUsers,
        privacyHardWipesExecuted,
        providerDistribution: [
          { name: "Gemini 1.5 Flash", value: 55 },
          { name: "Groq Llama 3.3", value: 30 },
          { name: "DeepSeek R1", value: 15 },
        ],
        riskBreakdown: [
          { level: "Low Risk", count: lowRiskCount },
          { level: "Medium Risk", count: mediumRiskCount },
          { level: "High Risk", count: highRiskCount },
          { level: "Critical Risk", count: criticalRiskCount },
        ],
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch admin stats" }, { status: 500 });
  }
}
