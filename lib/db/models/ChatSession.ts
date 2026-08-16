import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IChatSessionSchema extends MongooseDocument {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  attachedDocId?: string;
  attachedDocTitle?: string;
  messages: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    citations?: { sourceDocTitle: string; snippet: string; page?: number }[];
    providerUsed?: string;
    modelUsed?: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSessionSchema>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true },
    attachedDocId: { type: String },
    attachedDocTitle: { type: String },
    messages: [
      {
        id: String,
        role: { type: String, enum: ["user", "assistant", "system"] },
        content: String,
        citations: [{ sourceDocTitle: String, snippet: String, page: Number }],
        providerUsed: String,
        modelUsed: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const ChatSessionModel: mongoose.Model<IChatSessionSchema> =
  (mongoose.models.ChatSession as mongoose.Model<IChatSessionSchema>) ||
  mongoose.model<IChatSessionSchema>("ChatSession", ChatSessionSchema);
