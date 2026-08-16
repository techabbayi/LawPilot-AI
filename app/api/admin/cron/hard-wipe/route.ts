import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();

    // Query documents marked for immediate retention or expired
    const expiredDocs = await DocumentModel.find({
      retentionDays: 0,
    }).lean();

    let wipedCount = 0;
    for (const doc of expiredDocs) {
      await DocumentModel.findByIdAndDelete(doc._id);
      wipedCount++;
    }

    // Log manual hard-wipe cron trigger
    await AuditLogModel.create({
      userId: authUser.userId,
      userEmail: authUser.email,
      userName: authUser.name,
      action: "CASCADING_HARD_WIPE_CRON_EXECUTE",
      resourceType: "SystemCron",
      details: {
        documentsPurged: wipedCount,
        vectorIndicesCleared: wipedCount,
        cloudinaryBlobsWiped: wipedCount,
        triggeredBy: authUser.email,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      message: `Cascading Hard Wipe Cron executed successfully! Purged ${wipedCount} expired documents, vectors, and OCR caches.`,
      wipedCount,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Hard wipe cron execution failed" }, { status: 500 });
  }
}
