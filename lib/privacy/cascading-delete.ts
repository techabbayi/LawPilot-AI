import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { AnalysisModel } from "@/lib/db/models/Analysis";
import { ChatSessionModel } from "@/lib/db/models/ChatSession";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import { UserModel } from "@/lib/db/models/User";
import { deleteFromCloudinary } from "@/lib/storage/cloudinary";

export async function deleteDocumentCascade(documentId: string, userId: string): Promise<boolean> {
  await connectDB();

  try {
    const doc = await DocumentModel.findOne({ _id: documentId, userId });
    if (doc) {
      if (doc.cloudinaryPublicId) {
        await deleteFromCloudinary(doc.cloudinaryPublicId);
      }
      await DocumentModel.deleteOne({ _id: documentId });
    }

    // Delete associated analysis
    await AnalysisModel.deleteMany({ documentId });

    // Detach or cleanup chat sessions attached to this doc
    await ChatSessionModel.updateMany(
      { attachedDocId: documentId },
      { $unset: { attachedDocId: 1, attachedDocTitle: 1 } }
    );

    // Audit log entry
    await AuditLogModel.create({
      userId,
      action: "DOC_PERMANENT_CASCADE_DELETE",
      resource: `Document:${documentId}`,
      details: `Cascading permanent wipe completed for document ${documentId}`,
      ipAddress: "127.0.0.1",
      userAgent: "Privacy Engine",
    });

    return true;
  } catch (e) {
    console.error("Error during cascading document deletion:", e);
    return false;
  }
}

export async function deleteUserAccountCascade(userId: string): Promise<boolean> {
  await connectDB();

  try {
    // 1. Fetch user docs and delete from Cloudinary
    const docs = await DocumentModel.find({ userId });
    for (const doc of docs) {
      if (doc.cloudinaryPublicId) {
        await deleteFromCloudinary(doc.cloudinaryPublicId);
      }
    }

    // 2. Cascade delete all user records
    await DocumentModel.deleteMany({ userId });
    await AnalysisModel.deleteMany({ userId });
    await ChatSessionModel.deleteMany({ userId });
    await AuditLogModel.deleteMany({ userId });
    await UserModel.deleteOne({ _id: userId });

    return true;
  } catch (e) {
    console.error("Error during cascading account deletion:", e);
    return false;
  }
}
