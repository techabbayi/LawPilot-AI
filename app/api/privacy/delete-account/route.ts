import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { deleteUserAccountCascade } from "@/lib/privacy/cascading-delete";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const success = await deleteUserAccountCascade(user.userId);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    const res = NextResponse.json({ success: true, message: "Account and all associated records wiped permanently." });
    res.cookies.set("lawpilot_token", "", { expires: new Date(0), path: "/" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Account deletion failed" }, { status: 500 });
  }
}
