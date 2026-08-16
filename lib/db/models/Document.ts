import mongoose, { Schema, Document as MongooseDocument } from "mongoose";
import { FileType, RetentionPolicy } from "@/lib/types";

export interface IDocumentSchema extends MongooseDocument {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  fileName: string;
  fileUrl: string;
  cloudinaryPublicId?: string;
  fileType: FileType;
  sizeBytes: number;
  textContent: string;
  category: string;
  retentionPolicy: RetentionPolicy;
  expiresAt?: Date;
  status: "uploaded" | "parsing" | "parsed" | "error";
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    ocrUsed?: boolean;
    language?: string;
  };
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocumentSchema>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    fileType: { type: String, enum: ["pdf", "docx", "img", "txt"], required: true },
    sizeBytes: { type: Number, required: true },
    textContent: { type: String, default: "" },
    category: { type: String, default: "General", index: true },
    retentionPolicy: {
      type: String,
      enum: ["immediate", "24h", "7d", "30d", "90d", "keep"],
      default: "30d",
    },
    expiresAt: { type: Date, index: true },
    status: { type: String, enum: ["uploaded", "parsing", "parsed", "error"], default: "uploaded" },
    metadata: {
      pageCount: Number,
      wordCount: Number,
      ocrUsed: Boolean,
      language: String,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export const DocumentModel: mongoose.Model<IDocumentSchema> =
  (mongoose.models.Document as mongoose.Model<IDocumentSchema>) ||
  mongoose.model<IDocumentSchema>("Document", DocumentSchema);
