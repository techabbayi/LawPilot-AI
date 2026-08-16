"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, HardDriveDownload, Trash2, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1">
            Zero Data Compromise & Hard Wipe Guarantee
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy & Data Protection SLA</h1>
          <p className="text-xs sm:text-sm text-slate-300">Effective Date: January 1, 2026 • Enterprise Grade</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-6 space-y-8">
        <Card className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. 100% User Data Ownership & Zero AI Training
            </h2>
            <p>
              LawPilot AI guarantees that your contracts, NDAs, SaaS agreements, and uploaded legal documents remain 100% your private property. We NEVER train, fine-tune, or share customer legal documents with public or proprietary AI models.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" /> 2. Cascading Zero-Retention Engine
            </h2>
            <p>
              Uploaded documents and extracted text undergo automated cascading hard wipes according to your selected retention policy (Immediate, 24 Hours, 7 Days, or 30 Days).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 pt-1">
              <li><strong>Cloudinary Vault Assets:</strong> Permanently purged from cloud storage.</li>
              <li><strong>MongoDB Metadata:</strong> Deleted from active database collections.</li>
              <li><strong>Vector Index Matrices:</strong> Dense 128D embeddings erased from vector memory.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#1E3A8A]" /> 3. AES-256 Encrypted Credential Gateway
            </h2>
            <p>
              User API keys are encrypted at rest using AES-256-CBC encryption paired with PBKDF2 cryptographic salt derivation. Keys are decrypted strictly in-memory during real-time AI requests and are never stored in plain text.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <HardDriveDownload className="w-5 h-5 text-blue-600" /> 4. GDPR & CCPA Data Portability
            </h2>
            <p>
              You may download a complete structured JSON archive of your personal preferences, document audit logs, and account records at any time directly via the platform Privacy Governance settings.
            </p>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
