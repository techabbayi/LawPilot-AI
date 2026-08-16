import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IAISettingsSchema extends MongooseDocument {
  userId?: mongoose.Types.ObjectId | string;
  primaryProvider: string;
  fallbackProvider: string;
  temperature: number;
  maxTokens: number;
  apiKeysConfigured: {
    groq: boolean;
    gemini: boolean;
    openai: boolean;
    openrouter: boolean;
    llama: boolean;
    deepseek: boolean;
    qwen: boolean;
    anthropic?: boolean;
  };
  encryptedApiKeys?: {
    gemini?: string;
    groq?: string;
    openai?: string;
    openrouter?: string;
    deepseek?: string;
    anthropic?: string;
  };
  routingMode: string;
}

const AISettingsSchema = new Schema<IAISettingsSchema>(
  {
    userId: { type: Schema.Types.Mixed, index: true },
    primaryProvider: { type: String, default: "gemini" },
    fallbackProvider: { type: String, default: "groq" },
    temperature: { type: Number, default: 0.2 },
    maxTokens: { type: Number, default: 4096 },
    apiKeysConfigured: {
      groq: { type: Boolean, default: true },
      gemini: { type: Boolean, default: true },
      openai: { type: Boolean, default: false },
      openrouter: { type: Boolean, default: false },
      llama: { type: Boolean, default: true },
      deepseek: { type: Boolean, default: false },
      qwen: { type: Boolean, default: false },
      anthropic: { type: Boolean, default: false },
    },
    encryptedApiKeys: {
      gemini: { type: String, default: "" },
      groq: { type: String, default: "" },
      openai: { type: String, default: "" },
      openrouter: { type: String, default: "" },
      deepseek: { type: String, default: "" },
      anthropic: { type: String, default: "" },
    },
    routingMode: { type: String, enum: ["cost_optimized", "speed_optimized", "accuracy_optimized"], default: "accuracy_optimized" },
  },
  { timestamps: true }
);

export const AISettingsModel: mongoose.Model<IAISettingsSchema> =
  (mongoose.models.AISettings as mongoose.Model<IAISettingsSchema>) ||
  mongoose.model<IAISettingsSchema>("AISettings", AISettingsSchema);
