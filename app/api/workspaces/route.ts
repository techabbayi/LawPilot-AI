import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { WorkspaceModel } from "@/lib/db/models/Workspace";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const workspaces = await WorkspaceModel.find({
      $or: [{ ownerId: user.userId }, { "members.userId": user.userId }],
    }).lean();

    return NextResponse.json({ success: true, workspaces });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch workspaces" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const { name, description, memberEmail, memberRole } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
    }

    const initialMember = {
      userId: user.userId,
      userEmail: user.email || "counsel@lawpilot.ai",
      name: user.name || "Legal Counsel",
      role: "Enterprise Admin" as const,
      joinedAt: new Date(),
    };

    const newWorkspace = await WorkspaceModel.create({
      name,
      description,
      ownerId: user.userId,
      members: [initialMember],
      sharedDocIds: [],
    });

    // If an additional member email was specified, add them
    if (memberEmail && memberEmail.trim()) {
      newWorkspace.members.push({
        userId: `usr_${Date.now()}`,
        userEmail: memberEmail.trim(),
        name: memberEmail.split("@")[0],
        role: memberRole || "Legal Reviewer",
        joinedAt: new Date(),
      });
      await newWorkspace.save();
    }

    return NextResponse.json({ success: true, workspace: newWorkspace });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create workspace" }, { status: 500 });
  }
}
