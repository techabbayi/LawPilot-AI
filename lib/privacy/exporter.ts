import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { AnalysisModel } from "@/lib/db/models/Analysis";
import { ChatSessionModel } from "@/lib/db/models/ChatSession";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import { UserModel } from "@/lib/db/models/User";

export async function exportUserDataJSON(userId: string) {
  await connectDB();

  const user = await UserModel.findById(userId).lean();
  const documents = await DocumentModel.find({ userId }).lean();
  const analyses = await AnalysisModel.find({ userId }).lean();
  const chats = await ChatSessionModel.find({ userId }).lean();
  const auditLogs = await AuditLogModel.find({ userId }).lean();

  return {
    exportMetadata: {
      generatedAt: new Date().toISOString(),
      platform: "AI Legal Companion",
      version: "1.0.0-enterprise",
      privacyGuarantee: "User Data Ownership Export",
    },
    userProfile: user,
    documents,
    analyses,
    chatHistory: chats,
    auditLogs,
  };
}
