import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import { DocumentModel } from "@/lib/db/models/Document";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Enterprise Admin privileges required." }, { status: 403 });
    }

    await connectDB();

    const totalUsers = await UserModel.countDocuments();
    const adminCount = await UserModel.countDocuments({ role: "admin" });
    const totalDocuments = await DocumentModel.countDocuments();
    const totalAuditLogs = await AuditLogModel.countDocuments();

    // Calculate total revenue from Razorpay audit logs
    const paymentLogs = await AuditLogModel.find({ action: "RAZORPAY_PAYMENT_SUCCESS" });
    let totalRevenueInRupees = 0;
    const planPrices: Record<string, number> = { starter: 1999, pro: 4999, enterprise: 14999 };

    paymentLogs.forEach((log: any) => {
      const details = typeof log.details === "object" ? log.details : {};
      const plan = details?.plan || "pro";
      totalRevenueInRupees += planPrices[plan] || 4999;
    });

    const recentAuditLogs = await AuditLogModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        adminCount,
        totalDocuments,
        totalAuditLogs,
        totalRevenueInRupees,
        activeSubscriptions: paymentLogs.length || 1,
      },
      recentAuditLogs,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch admin overview" }, { status: 500 });
  }
}
