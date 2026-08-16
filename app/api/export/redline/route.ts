import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { generateRedlineDocumentHtml } from "@/lib/export/docxExporter";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { titleA, titleB, diffs } = await req.json();

    if (!diffs || !Array.isArray(diffs)) {
      return NextResponse.json({ error: "Comparison diff payload required" }, { status: 400 });
    }

    const htmlContent = generateRedlineDocumentHtml(
      titleA || "Contract Option A",
      titleB || "Contract Option B",
      diffs
    );

    // Serve as Word-compatible HTML document (.doc)
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/msword",
        "Content-Disposition": `attachment; filename="LawPilot_Redline_Markup_${Date.now()}.doc"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Redline export failed" }, { status: 500 });
  }
}
