import mongoose, { Schema, Document } from "mongoose";

export interface IAIFeedback extends Document {
  userId: mongoose.Types.ObjectId | string;
  messageId: string;
  query: string;
  responseSnippet: string;
  rating: "liked" | "disliked";
  createdAt: Date;
}

const AIFeedbackSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messageId: { type: String, required: true },
    query: { type: String, default: "" },
    responseSnippet: { type: String, default: "" },
    rating: { type: String, enum: ["liked", "disliked"], required: true },
  },
  { timestamps: true }
);

export const AIFeedbackModel =
  mongoose.models.AIFeedback || mongoose.model<IAIFeedback>("AIFeedback", AIFeedbackSchema);
