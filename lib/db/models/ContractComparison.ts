import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IContractComparisonSchema extends MongooseDocument {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  docA: { id: string; title: string; fileType: string };
  docB: { id: string; title: string; fileType: string };
  summary: string;
  riskDelta: "docA_safer" | "docB_safer" | "equal" | "high_risk_both";
  keyDifferences: {
    clauseCategory: string;
    docAText: string;
    docBText: string;
    analysis: string;
    winner: "docA" | "docB" | "neutral";
  }[];
  createdAt: Date;
}

const ComparisonSchema = new Schema<IContractComparisonSchema>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true },
    docA: { id: String, title: String, fileType: String },
    docB: { id: String, title: String, fileType: String },
    summary: { type: String, required: true },
    riskDelta: { type: String, enum: ["docA_safer", "docB_safer", "equal", "high_risk_both"], required: true },
    keyDifferences: [
      {
        clauseCategory: String,
        docAText: String,
        docBText: String,
        analysis: String,
        winner: { type: String, enum: ["docA", "docB", "neutral"] },
      },
    ],
  },
  { timestamps: true }
);

export const ComparisonModel: mongoose.Model<IContractComparisonSchema> =
  (mongoose.models.ContractComparison as mongoose.Model<IContractComparisonSchema>) ||
  mongoose.model<IContractComparisonSchema>("ContractComparison", ComparisonSchema);
