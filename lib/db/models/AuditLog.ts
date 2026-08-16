import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IAuditLogSchema extends MongooseDocument {
  userId?: mongoose.Types.ObjectId | string;
  userEmail?: string;
  userName?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  resourceType?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuditLogSchema = new Schema<IAuditLogSchema>(
  {
    userId: { type: Schema.Types.Mixed, index: true },
    userEmail: { type: String, index: true },
    userName: { type: String },
    action: { type: String, required: true, index: true },
    resource: { type: String },
    resourceId: { type: String },
    resourceType: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "Internal Server" },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const AuditLogModel: mongoose.Model<IAuditLogSchema> =
  (mongoose.models.AuditLog as mongoose.Model<IAuditLogSchema>) ||
  mongoose.model<IAuditLogSchema>("AuditLog", AuditLogSchema);
