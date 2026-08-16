import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/User";
import { AuditLogModel } from "@/lib/db/models/AuditLog";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 });
    }

    const { id } = await props.params;
    await connectDB();

    const targetUser = await UserModel.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "Target user account not found" }, { status: 404 });
    }

    // Prevent deleting primary Super Admin
    if (targetUser.email === "admin@lawpilot.ai") {
      return NextResponse.json({ error: "Root Super Admin account cannot be deleted" }, { status: 400 });
    }

    await UserModel.findByIdAndDelete(id);

    // Audit Log entry
    await AuditLogModel.create({
      userId: authUser.userId,
      userEmail: authUser.email,
      userName: authUser.name,
      action: "ADMIN_DELETE_USER",
      resourceId: id,
      resourceType: "User",
      details: { deletedEmail: targetUser.email, deletedName: targetUser.name },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: `User ${targetUser.email} deleted successfully.` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete user" }, { status: 500 });
  }
}
