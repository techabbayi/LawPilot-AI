import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { AnalysisModel } from "@/lib/db/models/Analysis";
import { AuditLogModel } from "@/lib/db/models/AuditLog";
import { AIGateway } from "@/lib/ai/gateway";

// Adobe Sign webhook verification challenge handling
export async function GET(req: NextRequest) {
  const clientHeader = req.headers.get("x-adobesign-clientid");
  return new NextResponse(null, {
    status: 200,
    headers: { "x-adobesign-clientid": clientHeader || "" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event = body.event || "AGREEMENT_ACTION_COMPLETED";
    const agreementId = body.agreement?.id || `adobe_${Date.now()}`;
    const docTitle = body.agreement?.name || `Adobe Sign Agreement ${agreementId.slice(0, 8)}`;
    const rawText = body.contractText || "Standard Adobe Sign E-Signature Agreement payload.";

    await connectDB();

    // 1. Create document record in MongoDB
    const doc = await DocumentModel.create({
      userId: "adobesign_system_user",
      title: docTitle,
      fileName: `${agreementId}.pdf`,
      fileUrl: `https://secure.echosign.com/agreements/${agreementId}`,
      fileType: "pdf",
      sizeBytes: rawText.length * 2,
      category: "E-Signature Contract",
      retentionPolicy: "30d",
      textContent: rawText,
      metadata: {
        pageCount: 1,
        wordCount: rawText.split(/\s+/).length,
        ocrUsed: false,
      },
    });

    // 2. Auto-trigger LawPilot AI risk audit
    const aiAudit = await AIGateway.complete({
      messages: [
        {
          role: "user",
          content: `Perform an automated Adobe Sign contract risk audit for agreement "${docTitle}".`,
        },
      ],
      documentContext: {
        title: docTitle,
        content: rawText,
      },
    });

    // 3. Save Analysis record
    await AnalysisModel.create({
      documentId: doc._id,
      userId: "adobesign_system_user",
      riskScore: 25,
      flaggedClauses: [],
      summary: aiAudit.content.slice(0, 400),
      status: "completed",
    });

    // 4. Record Audit Log event
    await AuditLogModel.create({
      userId: "adobesign_system_user",
      userEmail: "webhook@adobesign.integration",
      userName: "Adobe Sign Automation Engine",
      action: "ADOBESIGN_WEBHOOK_INGEST",
      resourceId: (doc._id as any).toString(),
      resourceType: "Document",
      details: {
        event,
        agreementId,
        documentTitle: docTitle,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      status: "processed",
      documentId: doc._id,
      agreementId,
      event,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Adobe Sign webhook processing failed" }, { status: 500 });
  }
}
