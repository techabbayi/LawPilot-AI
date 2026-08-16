import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface INotificationSchema extends MongooseDocument {
  userId: mongoose.Types.ObjectId | string;
  type: "alert" | "expiry" | "system" | "analysis";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationSchema>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    type: { type: String, enum: ["alert", "expiry", "system", "analysis"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const NotificationModel: mongoose.Model<INotificationSchema> =
  (mongoose.models.Notification as mongoose.Model<INotificationSchema>) ||
  mongoose.model<INotificationSchema>("Notification", NotificationSchema);
