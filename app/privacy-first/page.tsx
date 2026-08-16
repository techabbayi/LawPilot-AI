"use client";
export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck2,
  Trash2,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Code,
  Globe,
  Database,
} from "lucide-react";

export default function PrivacyFirstPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white py-20 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <Badge variant="accent" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs px-3.5 py-1.5 gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> World's #1 Privacy-First Open Source Legal AI Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            100% Transparent, Open Source & Zero Data Compromise
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed">
            LawPilot AI was built from the ground up for law firms, enterprise legal counsels, and compliance teams who demand total transparency, zero AI model training, and verifiable zero-retention data wiping.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/oss">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm gap-2 shadow-lg">
                <Code className="w-4 h-4" /> Explore Open Source Core (OSS)
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-300" /> View Privacy Policy SLA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Transparency */}
      <section className="py-20 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">The 4 Pillars of LawPilot AI Privacy</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Why enterprise legal teams trust LawPilot AI with their most sensitive commercial agreements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <Card className="p-8 space-y-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">100% Code Transparency & OSS Core</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike black-box legal tech platforms, our AI Gateway routing algorithms, dense 128D RAG vector matchers, and cascading hard wipe procedures are completely open source on GitHub. Anyone can inspect and audit our security protocols.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Verifiable MIT / Apache 2.0 Open Source Repositories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zero hidden telemetry or background tracking pixels
              </li>
            </ul>
          </Card>

          {/* Pillar 2 */}
          <Card className="p-8 space-y-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">Zero AI Model Training Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your uploaded contracts, NDAs, SaaS agreements, and confidential negotiations are NEVER used to train, fine-tune, or seed public or proprietary AI models. Your intellectual property remains 100% strictly yours.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Strict zero-data retention agreements with LLM providers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Ephemeral memory isolation per legal session
              </li>
            </ul>
          </Card>

          {/* Pillar 3 */}
          <Card className="p-8 space-y-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">Cascading Hard Wipe Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Set automated document retention periods (Immediate, 24 Hours, 7 Days, or 30 Days). When a file expires or is deleted, our cascading hard wipe protocol executes complete, unrecoverable data destruction.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Cloudinary file blobs permanently deleted
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> MongoDB documents & 128D RAG vector matrices purged
              </li>
            </ul>
          </Card>

          {/* Pillar 4 */}
          <Card className="p-8 space-y-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">AES-256 Encrypted Credential Gateway</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All user BYOK API keys (Gemini, Groq, OpenAI, DeepSeek) are stored encrypted at rest using AES-256-CBC with PBKDF2 cryptographic salt derivation. Keys are decrypted strictly in-memory during execution.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> In-memory ephemeral key decryption
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> SOC2 Type II & HIPAA compliance readiness
              </li>
            </ul>
          </Card>
        </div>

        {/* Interactive Privacy Pipeline Visualizer */}
        <Card className="p-8 bg-[#0F172A] text-white border border-slate-800 space-y-6">
          <div className="space-y-1 text-center">
            <Badge variant="accent" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs px-3 py-1">
              Zero Leak Architecture
            </Badge>
            <h3 className="text-xl font-bold">How Your Legal Data Flows Through LawPilot AI</h3>
            <p className="text-xs text-slate-400">Complete end-to-end data privacy lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-blue-300 flex items-center justify-center mx-auto font-bold">1</div>
              <span className="font-bold text-white block">Contract Upload</span>
              <p className="text-slate-400 text-[11px]">Client-side Tesseract OCR + AES-256 encrypted transit.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-blue-300 flex items-center justify-center mx-auto font-bold">2</div>
              <span className="font-bold text-white block">AI Clause Analysis</span>
              <p className="text-slate-400 text-[11px]">Zero-training AI model processing in ephemeral RAM.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-blue-300 flex items-center justify-center mx-auto font-bold">3</div>
              <span className="font-bold text-white block">Vector RAG Search</span>
              <p className="text-slate-400 text-[11px]">Localized 128D embeddings for instant clause matching.</p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center mx-auto font-bold">4</div>
              <span className="font-bold text-emerald-300 block">Cascading Hard Wipe</span>
              <p className="text-slate-400 text-[11px]">Automated complete destruction on retention expiry.</p>
            </div>
          </div>
        </Card>

        {/* CTA Footer Card */}
        <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[#0F172A]">Ready to audit contracts with complete privacy?</h3>
            <p className="text-xs text-slate-600">Start your enterprise workspace with zero hidden data retention today.</p>
          </div>
          <Link href="/signup">
            <Button size="lg" className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-sm gap-2 shrink-0">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
