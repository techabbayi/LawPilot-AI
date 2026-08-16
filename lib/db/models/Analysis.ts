import mongoose, { Schema, Document as MongooseDocument } from "mongoose";
import { RiskLevel } from "@/lib/types";

export interface IAnalysisSchema extends MongooseDocument {
  documentId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  executiveSummary: string;
  keyTerms: { label: string; value: string }[];
  detectedClauses: {
    id: string;
    clauseType: string;
    title: string;
    originalText: string;
    simplifiedExplanation: string;
    riskLevel: RiskLevel;
    recommendation: string;
    confidenceScore: number;
  }[];
  missingClauses: string[];
  actionableRecommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<IAnalysisSchema>(
  {
    documentId: { type: Schema.Types.Mixed, required: true, index: true },
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    overallRiskScore: { type: Number, required: true },
    overallRiskLevel: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
    executiveSummary: { type: String, required: true },
    keyTerms: [{ label: String, value: String }],
    detectedClauses: [
      {
        id: String,
        clauseType: String,
        title: String,
        originalText: String,
        simplifiedExplanation: String,
        riskLevel: { type: String, enum: ["low", "medium", "high", "critical"] },
        recommendation: String,
        confidenceScore: Number,
      },
    ],
    missingClauses: [String],
    actionableRecommendations: [String],
  },
  { timestamps: true }
);

export const AnalysisModel: mongoose.Model<IAnalysisSchema> =
  (mongoose.models.Analysis as mongoose.Model<IAnalysisSchema>) ||
  mongoose.model<IAnalysisSchema>("Analysis", AnalysisSchema);
