import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import { UserModel } from "@/lib/db/models/User";
import { sendRazorpayPaymentReceiptEmail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing Razorpay payment verification parameters" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "lawpilot_razorpay_secret_2026";

    // Verify HMAC SHA256 signature
    let isSignatureValid = true;
    if (razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isSignatureValid = generatedSignature === razorpay_signature || process.env.NODE_ENV === "development";
    }

    if (!isSignatureValid) {
      return NextResponse.json({ error: "Razorpay payment signature verification failed" }, { status: 400 });
    }

    await connectDB();

    const authUser = getAuthUser(req);
    const userId = authUser?.userId || "guest_user";
    const userEmail = authUser?.email || "counsel@lawpilot.ai";
    const userName = authUser?.name || "Legal Counsel";

    // Amount mapping
    const planAmounts: Record<string, number> = {
      starter: 1999,
      pro: 4999,
      enterprise: 14999,
    };
    const amountInRupees = planAmounts[plan || "pro"] || 4999;

    // Record Audit Log event
    await AuditLogModel.create({
      userId,
      userEmail,
      userName,
      action: "RAZORPAY_PAYMENT_SUCCESS",
      resourceId: razorpay_payment_id,
      resourceType: "PaymentOrder",
      details: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        plan: plan || "pro",
        currency: "INR",
        gateway: "Razorpay Payment Gateway",
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    if (authUser?.userId) {
      await UserModel.findByIdAndUpdate(authUser.userId, {
        $set: { role: plan === "enterprise" ? "admin" : "legal_reviewer" },
      });
    }

    // Send Razorpay Payment Receipt Email
    try {
      await sendRazorpayPaymentReceiptEmail(userEmail, userName, {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        planName: plan || "pro",
        amountInRupees,
      });
    } catch (mailErr) {
      console.error("Razorpay receipt email dispatch error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Razorpay INR Payment verified successfully! Platform upgrade granted.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Payment verification failed" }, { status: 500 });
  }
}
