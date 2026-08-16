import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { exportUserDataJSON } from "@/lib/privacy/exporter";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const exportData = await exportUserDataJSON(user.userId);
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="LawPilot_Privacy_Export_${user.userId}_${Date.now()}.json"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Export failed" }, { status: 500 });
  }
}
