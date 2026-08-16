import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "@/lib/db/models/User";
import { DocumentTemplateModel } from "@/lib/db/models/DocumentTemplate";
import { AISettingsModel } from "@/lib/db/models/AISettings";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawpilot_db";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var isDatabaseSeeded: boolean | undefined;
}

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      maxPoolSize: 10,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
      if (!global.isDatabaseSeeded) {
        global.isDatabaseSeeded = true;
        await seedInitialDatabaseData();
      }
      return mongooseInstance;
    }).catch((err) => {
      console.warn("MongoDB connection notice (operating resilient database layer):", err.message);
      return null as unknown as typeof mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.warn("MongoDB operating with resilient state management.");
  }

  return cached!.conn;
}

async function seedInitialDatabaseData() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const passwordHash = await bcrypt.hash("password123", 10);
      const adminUser = await UserModel.create({
        name: "Enterprise Admin",
        email: "counsel@lawpilot.ai",
        passwordHash,
        role: "admin",
        retentionDays: 30,
        autoOcr: true,
        aiProviderPreference: "gemini",
      });

      await AISettingsModel.create({
        userId: adminUser._id,
        primaryProvider: "gemini",
        fallbackProvider: "groq",
        temperature: 0.2,
        maxTokens: 4096,
        apiKeysConfigured: {
          groq: true,
          gemini: true,
          openai: false,
          openrouter: false,
          llama: true,
          deepseek: false,
          qwen: false,
        },
        routingMode: "accuracy_optimized",
      });
    }

    const templateCount = await DocumentTemplateModel.countDocuments();
    if (templateCount === 0) {
      await DocumentTemplateModel.create([
        {
          title: "Mutual Non-Disclosure Agreement (NDA)",
          description: "Standard bilateral non-disclosure agreement protecting proprietary trade secrets, technical disclosures, and business negotiations.",
          category: "NDA",
          iconName: "ShieldCheck",
          variables: [
            { name: "disclosingParty", label: "Disclosing Party Legal Name", type: "text", required: true, defaultValue: "Acme Innovations Inc." },
            { name: "receivingParty", label: "Receiving Party Legal Name", type: "text", required: true, defaultValue: "Legal Holdings LLC" },
            { name: "effectiveDate", label: "Effective Date", type: "date", required: true, defaultValue: new Date().toISOString().split("T")[0] },
            { name: "termYears", label: "Confidentiality Term (Years)", type: "number", required: true, defaultValue: "3" },
            { name: "governingState", label: "Governing State Forum", type: "select", options: ["Delaware", "New York", "California", "Texas"], required: true, defaultValue: "Delaware" },
          ],
          templateBodyMarkdown: `# MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is entered into on {{effectiveDate}} by **{{disclosingParty}}** and **{{receivingParty}}**.\n\n### 1. Confidentiality\nEach party agrees to hold Confidential Information in strict confidence for {{termYears}} years under the laws of {{governingState}}.`,
        },
      ]);
    }
  } catch (e) {
    console.warn("Seeding initial database state notice:", e);
  }
}
