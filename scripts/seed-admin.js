/**
 * LawPilot AI - Standalone Super Admin Seeder Script
 * Run using: node scripts/seed-admin.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawpilot_db";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["user", "legal_reviewer", "admin"], default: "user" },
    designation: { type: String, default: "" },
    organization: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    retentionDays: { type: Number, default: 30 },
    autoOcr: { type: Boolean, default: true },
    aiProviderPreference: { type: String, default: "gemini" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const adminEmail = "admin@lawpilot.ai";
  let existingUser = await User.findOne({ email: adminEmail });

  if (existingUser) {
    console.log(`\nSuper Admin account already exists in MongoDB!`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Role: ${existingUser.role}`);
  } else {
    const passwordHash = await bcrypt.hash("AdminPassword@2026", 10);
    const newAdmin = await User.create({
      name: "LawPilot Super Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
      designation: "Chief Compliance Officer & Super Admin",
      organization: "LawPilot Enterprise AI",
      retentionDays: 30,
      autoOcr: true,
      aiProviderPreference: "gemini",
    });

    console.log("\nSuper Admin account created successfully!");
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Password: AdminPassword@2026`);
    console.log(`   Role: ${newAdmin.role}`);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. Done!\n");
}

seedAdmin().catch((err) => {
  console.error("Seeding Error:", err);
  process.exit(1);
});
