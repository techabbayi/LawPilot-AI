import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocumentTemplateSchema extends MongooseDocument {
  title: string;
  description: string;
  category: string;
  iconName: string;
  variables: {
    name: string;
    label: string;
    type: "text" | "date" | "number" | "select" | "textarea";
    options?: string[];
    placeholder?: string;
    defaultValue?: string;
    required: boolean;
  }[];
  templateBodyMarkdown: string;
  createdAt: Date;
}

const TemplateSchema = new Schema<IDocumentTemplateSchema>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    iconName: { type: String, default: "FileText" },
    variables: [
      {
        name: String,
        label: String,
        type: { type: String, enum: ["text", "date", "number", "select", "textarea"] },
        options: [String],
        placeholder: String,
        defaultValue: String,
        required: Boolean,
      },
    ],
    templateBodyMarkdown: { type: String, required: true },
  },
  { timestamps: true }
);

export const DocumentTemplateModel: mongoose.Model<IDocumentTemplateSchema> =
  (mongoose.models.DocumentTemplate as mongoose.Model<IDocumentTemplateSchema>) ||
  mongoose.model<IDocumentTemplateSchema>("DocumentTemplate", TemplateSchema);
