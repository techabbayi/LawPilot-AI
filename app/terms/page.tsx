"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-blue-400/20 text-blue-200 border-blue-400/30 text-xs px-3 py-1">
            Enterprise Legal Terms
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service & Platform Master Agreement</h1>
          <p className="text-xs sm:text-sm text-slate-300">Effective Date: January 1, 2026 • Version 2.4</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-6 space-y-8">
        <Card className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#1E3A8A]" /> 1. Acceptance & Enterprise Agreement
            </h2>
            <p>
              By accessing or using the LawPilot AI Platform ("Service"), operated by LawPilot Enterprise AI Technologies, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a law firm, corporation, or corporate legal department, you represent that you have authority to bind that entity.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 2. Data Ownership & Cascading Deletion
            </h2>
            <p>
              You retain 100% full ownership of all contracts, documents, vector embeddings, and text snippets uploaded to LawPilot AI. LawPilot AI executes strict zero-retention policies. Upon expiration of your configured retention period (Immediate, 24 Hours, 7 Days, or 30 Days), documents and vectors undergo permanent cascading hard deletion.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1E3A8A]" /> 3. Legal Intelligence & Practice Disclaimer
            </h2>
            <p>
              LawPilot AI provides automated contract risk scoring, indemnification analysis, version comparison, and draft clause generation. While our AI models deliver high-precision legal intelligence, LawPilot AI is an analysis tool and does not constitute formal legal representation or licensed legal counsel.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A]">4. Billing & Razorpay INR Subscriptions</h2>
            <p>
              Subscription payments are processed in Indian Rupees (INR) via Razorpay Payment Gateway. Subscriptions automatically renew monthly or annually based on your selection. You may manage or cancel your subscription at any time via Account Governance.
            </p>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
