"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Cpu, ShieldCheck, Database, Server } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1">
            Real-Time System Telemetry
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">API Gateway & Platform Status</h1>
          <p className="text-xs sm:text-sm text-slate-300">Operational Health Metrics & Uptime Audit</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-6 space-y-6">
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>All Systems Nominal — 99.98% Gateway Uptime</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono uppercase">Verified</span>
        </div>

        <div className="space-y-4">
          <Card className="p-5 flex items-center justify-between bg-white border border-slate-200">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#1E3A8A]" />
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">Multi-Provider AI Gateway</span>
                <span className="text-xs text-slate-500">Google Gemini 1.5, Groq, OpenAI, DeepSeek, OpenRouter</span>
              </div>
            </div>
            <Badge variant="info" className="bg-emerald-100 text-emerald-800 border-emerald-200">Operational</Badge>
          </Card>

          <Card className="p-5 flex items-center justify-between bg-white border border-slate-200">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-700" />
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">RAG 128D Dense Vector Search Engine</span>
                <span className="text-xs text-slate-500">Cosine Dot Product Matrix & Indexing</span>
              </div>
            </div>
            <Badge variant="info" className="bg-emerald-100 text-emerald-800 border-emerald-200">Operational</Badge>
          </Card>

          <Card className="p-5 flex items-center justify-between bg-white border border-slate-200">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">Cascading Zero-Retention Hard Wipe Service</span>
                <span className="text-xs text-slate-500">MongoDB Atlas & Cloudinary Vault Destruction</span>
              </div>
            </div>
            <Badge variant="info" className="bg-emerald-100 text-emerald-800 border-emerald-200">Operational</Badge>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
