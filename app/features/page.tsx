"use client";
export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  ShieldCheck,
  Split,
  FileSearch,
  FileText,
  Lock,
  Zap,
  ArrowRight,
  Database,
  Search,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0F172A] via-blue-950 to-[#0F172A] text-white py-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs px-3 py-1">
            Enterprise Legal Architecture
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Platform Capabilities & Legal AI Gateway</h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Explore the complete suite of automated contract audit engines, multi-provider LLM routing, dense vector search, and zero-retention data security.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">Multi-Provider AI Gateway</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Route contract queries dynamically across Google Gemini 1.5 Flash, Groq Llama 3.3 70B, OpenAI GPT-4o, OpenRouter, and DeepSeek R1 with zero downtime failover.
            </CardDescription>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">Cascading Hard Wipe Privacy</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Configure strict document retention counts (Immediate, 24h, 7d, 30d). Cascading hard deletion destroys uploaded files, OCR text, and vector indices permanently.
            </CardDescription>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Split className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">Side-by-Side Redline Comparator</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Compare base vs target agreement versions. Performs structural diffs, scores winner liability balances, and exports redline .docx markup.
            </CardDescription>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">OCR PDF & DOCX Risk Audit</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Scans PDF, DOCX, and scanned images using Tesseract OCR. Extracts indemnities, termination covenants, IP grants, and computes a 0-100 risk score.
            </CardDescription>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">52 Template Contract Generator</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Step-by-step form wizard for generating pre-audited legal contracts across 14 legal categories including NDAs, SaaS MSAs, Employment, and IP Licensing.
            </CardDescription>
          </Card>

          <Card className="p-8 space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-900 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">RAG 128D Dense Vector Search</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-600">
              Real 128-dimensional dense float vector embedding generator and cosine dot product similarity matcher across law vault documents.
            </CardDescription>
          </Card>
        </div>

        <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">Ready to audit contracts with AI?</h3>
            <p className="text-xs text-slate-600 mt-1">Get started now with instant workspace access.</p>
          </div>
          <Link href="/login">
            <Button size="lg" className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs gap-1.5">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
