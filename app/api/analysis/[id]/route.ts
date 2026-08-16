import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AnalysisModel } from "@/lib/db/models/Analysis";
import { DocumentModel } from "@/lib/db/models/Document";
import { analyzeLegalText } from "@/lib/documents/parser";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    let analysis = await AnalysisModel.findOne({ documentId: id }).lean();
    if (!analysis) {
      const doc = await DocumentModel.findById(id).lean();
      if (doc) {
        const payload = analyzeLegalText(doc._id.toString(), user.userId, doc.textContent);
        analysis = (await AnalysisModel.create(payload)).toObject() as any;
      } else {
        // Fallback demo analysis for seed document
        return NextResponse.json({
          analysis: {
            _id: `an_${id}`,
            documentId: id,
            userId: user.userId,
            overallRiskScore: 68,
            overallRiskLevel: "high",
            executiveSummary: "The document exhibits un-capped indemnification provisions, asymmetrical termination notice rules, and non-standard governing forum choices. Strategic renegotiation recommended.",
            keyTerms: [
              { label: "Document Type", value: "Enterprise SaaS Agreement" },
              { label: "Governing Law", value: "State of New York" },
              { label: "Notice Period", value: "15 Days" },
            ],
            detectedClauses: [
              {
                id: "cl_1",
                clauseType: "Indemnification",
                title: "Unilateral Indemnity Exposure",
                originalText: "Customer shall indemnify, defend, and hold harmless Provider against any third-party claims, liabilities, damages, or costs...",
                simplifiedExplanation: "You are required to pay Provider's legal defense and judgments if a third party sues them due to your platform use.",
                riskLevel: "high",
                recommendation: "Demand mutual indemnification and cap total exposure to 12 months' paid subscription fees.",
                confidenceScore: 0.94,
              },
              {
                id: "cl_2",
                clauseType: "Limitation of Liability",
                title: "Aggregate Liability Cap",
                originalText: "Provider's total aggregate liability shall not exceed the amount paid by Customer in the one (1) month preceding the incident.",
                simplifiedExplanation: "Provider limits their maximum liability to just 1 month of subscription fees, while your liability remains uncapped.",
                riskLevel: "critical",
                recommendation: "Increase Provider's liability cap to 12 months and remove unilateral asymmetry.",
                confidenceScore: 0.96,
              },
              {
                id: "cl_3",
                clauseType: "Termination",
                title: "Termination for Cause & Convenience",
                originalText: "Provider may terminate this agreement at any time upon 7 days written notice without cause.",
                simplifiedExplanation: "The vendor can cancel your service on 7 days notice without giving any reason.",
                riskLevel: "medium",
                recommendation: "Require minimum 30 days notice for termination without cause.",
                confidenceScore: 0.88,
              },
            ],
            missingClauses: [
              "Mutual Non-Disclosure & Data Protection Covenant",
              "Force Majeure / Disaster Recovery Commitment",
              "Service Level Agreement (SLA) Uptime Guarantee",
            ],
            actionableRecommendations: [
              "Renegotiate Section 2 to introduce reciprocal indemnification.",
              "Adjust Section 3 to establish a symmetrical 12-month liability cap.",
              "Require a formal 30-day notice for convenience termination.",
            ],
            createdAt: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.json({ analysis });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch analysis" }, { status: 500 });
  }
}
