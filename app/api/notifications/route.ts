import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = [
    {
      _id: "notif_1",
      type: "alert",
      title: "Critical Clause Warning",
      message: "Unilateral indemnification detected in 'Master_SaaS_Agreement_2026.pdf'",
      link: "/analyzer?docId=seed_doc_01",
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "notif_2",
      type: "expiry",
      title: "Retention Policy Warning",
      message: "'Lease_Scan_2026.png' is scheduled for automatic hard deletion in 24 hours.",
      link: "/vault",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "notif_3",
      type: "system",
      title: "AI Gateway Provider Updated",
      message: "Switched active AI fallback provider to Groq Llama 3.3 for enhanced throughput.",
      link: "/settings/ai",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return NextResponse.json({ notifications });
}
