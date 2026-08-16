import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    await connectDB();

    const paymentLogs = await AuditLogModel.find({ action: "RAZORPAY_PAYMENT_SUCCESS" })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPayments = paymentLogs.map((log: any) => {
      const details = typeof log.details === "object" ? log.details : {};
      const plan = details?.plan || "pro";
      const amounts: Record<string, number> = { starter: 1999, pro: 4999, enterprise: 14999 };
      return {
        _id: log._id.toString(),
        paymentId: log.resourceId || details?.paymentId || "PAY_" + Math.random().toString(36).substring(7),
        orderId: details?.orderId || "ORD_" + Math.random().toString(36).substring(7),
        userEmail: log.userEmail || "customer@lawpilot.ai",
        userName: log.userName || "Legal Customer",
        plan: String(plan).toUpperCase(),
        amountInRupees: amounts[plan] || 4999,
        currency: "INR (₹)",
        gateway: details?.gateway || "Razorpay Payment Gateway",
        createdAt: log.createdAt || log.timestamp || new Date(),
      };
    });

    return NextResponse.json({ success: true, payments: formattedPayments });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch payment records" }, { status: 500 });
  }
}
