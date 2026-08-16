"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, CheckCircle2, ShieldAlert, Cpu, EyeOff, KeyRound } from "lucide-react";

export default function AdminSecurityPage() {
  return (
    <DashboardWrapper title="System Security & Encryption Architecture">
      <div className="space-y-8 max-w-6xl mx-auto font-sans">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Enterprise Security Architecture & Compliance SLA</h1>
          <p className="text-xs text-slate-500">Overview of cryptographic safeguards, multi-provider key isolation, and zero-retention compliance policies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6 bg-white border border-slate-200 shadow-xs">
            <CardHeader className="p-0 pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Automated Zero-Retention Data Lifecycle
              </CardTitle>
              <CardDescription>Automated background protocols ensuring complete data privacy.</CardDescription>
            </CardHeader>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl space-y-2">
                <span className="font-bold block text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Background Hard-Wipe Status
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Cascading hard wipes execute automatically on document retention expiration. Expired PDF/DOCX files, MongoDB metadata, OCR text extractions, and RAG 128D float vector embeddings are permanently destroyed with zero manual intervention required.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Cloudinary Blob Asset Storage</span>
                  <Badge variant="accent">Automated Wipe</Badge>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-slate-700">MongoDB Document Models</span>
                  <Badge variant="accent">Automated Wipe</Badge>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-slate-700">128D Dense Vector Matrices</span>
                  <Badge variant="accent">Automated Wipe</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6 bg-white border border-slate-200 shadow-xs">
            <CardHeader className="p-0 pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E3A8A]" /> Cryptographic Safeguards & Credential Security
              </CardTitle>
              <CardDescription>Multi-tenant key protection and authentication controls.</CardDescription>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">AES-256-CBC PBKDF2 Encryption</span>
                  <span className="text-slate-500 text-[11px]">User BYOK API keys encrypted with cryptographic salts</span>
                </div>
                <Badge variant="accent">Active</Badge>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Zero AI Model Training SLA</span>
                  <span className="text-slate-500 text-[11px]">Customer documents isolated from AI training loops</span>
                </div>
                <Badge variant="accent">Enforced</Badge>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">HTTP-Only JWT Token Security</span>
                  <span className="text-slate-500 text-[11px]">Multi-layer cookie session expiration on logout</span>
                </div>
                <Badge variant="accent">Active</Badge>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0F172A] block">Role-Based Access Control (RBAC)</span>
                  <span className="text-slate-500 text-[11px]">Strict Next.js middleware guards on /admin routes</span>
                </div>
                <Badge variant="accent">Enforced</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardWrapper>
  );
}
