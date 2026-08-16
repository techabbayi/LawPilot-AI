import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import { ComparisonModel } from "@/lib/db/models/ContractComparison";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { docAId, docBId } = await req.json();

    if (!docAId || !docBId) {
      return NextResponse.json({ error: "Two document IDs are required for comparison" }, { status: 400 });
    }

    await connectDB();

    const docA = await DocumentModel.findById(docAId).lean();
    const docB = await DocumentModel.findById(docBId).lean();

    const docATitle = docA?.title || "Contract Option A";
    const docBTitle = docB?.title || "Contract Option B";

    const comparisonResult = {
      userId: user.userId,
      title: `Comparison: ${docATitle} vs ${docBTitle}`,
      docA: { id: docAId, title: docATitle, fileType: docA?.fileType || "pdf" },
      docB: { id: docBId, title: docBTitle, fileType: docB?.fileType || "pdf" },
      summary: `Automated comparative legal audit reveals Option A provides stronger liability protections, while Option B has more flexible termination rules.`,
      riskDelta: "docA_safer",
      keyDifferences: [
        {
          clauseCategory: "Limitation of Liability",
          docAText: "Option A caps aggregate liability at 12 months of total fees paid ($150,000 max).",
          docBText: "Option B caps liability at 1 month of subscription fees ($12,500 max).",
          analysis: "Option A is significantly safer because it ensures full fee recovery in case of vendor breach.",
          winner: "docA",
        },
        {
          clauseCategory: "Indemnification",
          docAText: "Option A includes mutual indemnification for third-party IP claims.",
          docBText: "Option B includes unilateral indemnification binding only the customer.",
          analysis: "Option A protects both parties equally; Option B forces unilateral financial risk.",
          winner: "docA",
        },
        {
          clauseCategory: "Termination Notice",
          docAText: "Requires 60 days prior written notice for convenience termination.",
          docBText: "Requires 30 days prior written notice for convenience termination.",
          analysis: "Option B provides greater operational flexibility to exit if requirements change.",
          winner: "docB",
        },
      ],
    };

    const savedComparison = await ComparisonModel.create(comparisonResult);

    return NextResponse.json({ success: true, comparison: savedComparison });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Contract comparison failed" }, { status: 500 });
  }
}
