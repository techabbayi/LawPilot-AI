import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspaceMember {
  userId: string;
  userEmail: string;
  name: string;
  role: "Viewer" | "Legal Reviewer" | "Compliance Approver" | "Enterprise Admin";
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  ownerId: string;
  members: IWorkspaceMember[];
  sharedDocIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceMemberSchema = new Schema<IWorkspaceMember>({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["Viewer", "Legal Reviewer", "Compliance Approver", "Enterprise Admin"],
    default: "Legal Reviewer",
  },
  joinedAt: { type: Date, default: Date.now },
});

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: String, required: true },
    members: [WorkspaceMemberSchema],
    sharedDocIds: [{ type: String }],
  },
  { timestamps: true }
);

export const WorkspaceModel =
  mongoose.models.Workspace || mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
