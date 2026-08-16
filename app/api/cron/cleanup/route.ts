import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { deleteDocumentCascade } from "@/lib/privacy/cascading-delete";

export async function GET() {
  await connectDB();

  try {
    const now = new Date();
    const expiredDocs = await DocumentModel.find({
      expiresAt: { $lte: now },
      isDeleted: false,
    });

    let count = 0;
    for (const doc of expiredDocs) {
      await deleteDocumentCascade(doc._id.toString(), doc.userId.toString());
      count++;
    }

    return NextResponse.json({
      success: true,
      cleanedCount: count,
      executedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Retention cleanup failed" }, { status: 500 });
  }
}
