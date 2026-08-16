import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { DocumentModel } from "@/lib/db/models/Document";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 });
    }

    const dbStart = performance.now();
    await connectDB();
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }
    const dbLatencyMs = Math.round(performance.now() - dbStart);

    // 1. User Demographics Analytics
    const totalUsers = await UserModel.countDocuments();
    const adminUsersCount = await UserModel.countDocuments({ role: "admin" });
    const reviewerUsersCount = await UserModel.countDocuments({ role: "legal_reviewer" });
    const standardUsersCount = await UserModel.countDocuments({ role: { $in: ["user", undefined] } });

    // 2. Document Intelligence Analytics
    const totalDocs = await DocumentModel.countDocuments();
    const ndaCount = await DocumentModel.countDocuments({ category: { $regex: /nda/i } });
    const serviceAgreementCount = await DocumentModel.countDocuments({ category: { $regex: /service/i } });
    const employmentCount = await DocumentModel.countDocuments({ category: { $regex: /employment/i } });
    const otherCategoryCount = Math.max(0, totalDocs - (ndaCount + serviceAgreementCount + employmentCount));

    // 3. Razorpay INR Revenue & Subscription Analytics
    const paymentLogs = await AuditLogModel.find({ action: "RAZORPAY_PAYMENT_SUCCESS" });
    let totalRevenueInRupees = 0;
    let starterPlanCount = 0;
    let proPlanCount = 0;
    let enterprisePlanCount = 0;

    paymentLogs.forEach((log: any) => {
      const details = typeof log.details === "object" ? log.details : {};
      const plan = String(details?.plan || "pro").toLowerCase();
      if (plan === "starter") {
        starterPlanCount++;
        totalRevenueInRupees += 1999;
      } else if (plan === "enterprise") {
        enterprisePlanCount++;
        totalRevenueInRupees += 14999;
      } else {
        proPlanCount++;
        totalRevenueInRupees += 4999;
      }
    });

    // 4. Audit Stream & Security Telemetry
    const totalLogs = await AuditLogModel.countDocuments();
    const loginsCount = await AuditLogModel.countDocuments({ action: { $regex: /login/i } });
    const hardWipeLogsCount = await AuditLogModel.countDocuments({ action: { $regex: /hard_wipe/i } });

    // Process Memory & Uptime
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const rssMB = (memoryUsage.rss / 1024 / 1024).toFixed(2);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development",
        memory: {
          heapUsedMB: `${heapUsedMB} MB`,
          rssMB: `${rssMB} MB`,
        },
        dbLatencyMs: `${dbLatencyMs} ms`,
      },
      analytics: {
        users: {
          total: totalUsers,
          admins: adminUsersCount,
          legalReviewers: reviewerUsersCount,
          standardUsers: standardUsersCount,
        },
        revenue: {
          totalRevenueInRupees,
          totalOrders: paymentLogs.length,
          starterPlanCount,
          proPlanCount,
          enterprisePlanCount,
          arpuInRupees: totalUsers > 0 ? Math.round(totalRevenueInRupees / totalUsers) : 0,
        },
        documents: {
          totalUploaded: totalDocs,
          ndaCount,
          serviceAgreementCount,
          employmentCount,
          otherCategoryCount,
          zeroRetentionActive: totalDocs,
        },
        securityAudit: {
          totalAuditEvents: totalLogs,
          loginsCount,
          paymentsCount: paymentLogs.length,
          hardWipesExecutedCount: hardWipeLogsCount,
        },
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
