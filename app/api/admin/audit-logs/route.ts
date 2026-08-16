import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Enterprise Admin privileges required" }, { status: 403 });
    }

    await connectDB();

    const rawLogs = await AuditLogModel.find({})
      .sort({ createdAt: -1, timestamp: -1 })
      .limit(100)
      .lean();

    const formattedLogs = rawLogs.map((log: any) => {
      const detailsStr =
        typeof log.details === "object"
          ? JSON.stringify(log.details)
          : String(log.details || "No details recorded");

      return {
        _id: log._id.toString(),
        timestamp: log.createdAt || log.timestamp || new Date(),
        action: log.action || "SYSTEM_EVENT",
        userEmail: log.userEmail || "System Engine",
        userName: log.userName || "System",
        resource: log.resource || log.resourceType || "System",
        ipAddress: log.ipAddress || "127.0.0.1",
        details: detailsStr,
      };
    });

    return NextResponse.json({ success: true, logs: formattedLogs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}
