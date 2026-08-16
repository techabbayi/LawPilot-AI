import mongoose, { Schema, Document as MongooseDocument } from "mongoose";
import { UserRole } from "@/lib/types";

export interface IUserSchema extends MongooseDocument {
  name: string;
  email: string;
  designation?: string;
  organization?: string;
  websiteUrl?: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  googleId?: string;
  retentionDays: number;
  autoOcr: boolean;
  aiProviderPreference: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserSchema>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    designation: { type: String, default: "" },
    organization: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    passwordHash: { type: String },
    role: { type: String, enum: ["user", "legal_reviewer", "admin"], default: "user", index: true },
    avatarUrl: { type: String },
    googleId: { type: String },
    retentionDays: { type: Number, default: 30 },
    autoOcr: { type: Boolean, default: true },
    aiProviderPreference: { type: String, default: "gemini" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export const UserModel: mongoose.Model<IUserSchema> =
  (mongoose.models.User as mongoose.Model<IUserSchema>) ||
  mongoose.model<IUserSchema>("User", UserSchema);
