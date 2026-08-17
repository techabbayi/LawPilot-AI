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
  Scale,
  ShieldCheck,
  Cpu,
  Layers,
  Lock,
  Mail,
  Github,
  Code,
  User,
  Sparkles,
  CheckCircle2,
  Zap,
  Globe,
  FileText,
  Terminal,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0F172A] via-blue-950 to-[#0F172A] text-white py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-5 relative z-10">
          <Badge variant="accent" className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs px-3.5 py-1 gap-1.5 inline-flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Platform Architecture & Mission
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About LawPilot AI & Foundational Vision
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Democratizing privacy-first legal AI, autonomous document intelligence, zero-retention data masking, and multi-LLM gateway routing for global legal professionals.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
            <Badge variant="info" className="gap-1 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero-Retention Privacy
            </Badge>
            <Badge variant="neutral" className="gap-1 py-1">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> Multi-LLM Gateway
            </Badge>
            <Badge variant="accent" className="gap-1 py-1">
              <Code className="w-3.5 h-3.5 text-purple-400" /> Open Source Core
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 max-w-5xl mx-auto px-6 space-y-12">
        {/* Section 1: About the Project */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">1. About LawPilot AI</h2>
              <p className="text-xs sm:text-sm text-slate-500">Enterprise Legal Intelligence & Privacy-Preserving AI Infrastructure</p>
            </div>
          </div>

          <Card className="p-8 bg-white border border-slate-200 shadow-sm space-y-6">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>LawPilot AI</strong> is a next-generation enterprise legal technology platform engineered to bridge the gap between high-speed generative artificial intelligence and enterprise data security compliance. Built specifically for law firms, corporate legal departments, contract auditors, and compliance officers, LawPilot AI automates clause analysis, risk audits, missing covenant discovery, and legal research without ever compromising sensitive client data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Core Feature 1 */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">Automated PII & Registration Sanitizer</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before prompts reach external LLM endpoints, LawPilot AI automatically detects and masks Credit Cards, Indian PAN, Aadhaar, Corporate CIN, GSTIN, LLPIN, phone numbers, and emails.
                </p>
              </div>

              {/* Core Feature 2 */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">Multi-LLM Gateway & Fallback Cascade</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seamless intra-provider fallback between Gemini 3 Flash Preview, Gemini 2.0 Flash, Groq Llama 3.3 70B, OpenRouter, OpenAI GPT-4o, and DeepSeek R1 to guarantee zero downtime.
                </p>
              </div>

              {/* Core Feature 3 */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">128D Dense Vector RAG Engine</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semantic sliding-window contract chunking paired with L2-normalized Cosine Similarity dot-product math to retrieve accurate clause citations into the AI context.
                </p>
              </div>

              {/* Core Feature 4 */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">Autonomous Vault & OCR Engine</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parse, OCR, analyze, and manage PDF, DOCX, DOC, and TXT files with a 200MB limit, custom retention policies (1d, 7d, 30d, 90d, forever), and instant MongoDB indexing.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Section 2: About the Author */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">2. About the Author</h2>
              <p className="text-xs sm:text-sm text-slate-500">Creator, Lead Architect & Open Source Maintainer</p>
            </div>
          </div>

          <Card className="p-8 bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-blue-900 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
                TA
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F172A]">techabbayi</h3>
                    <p className="text-xs font-semibold text-blue-700">Full-Stack AI Architect & Systems Engineer</p>
                  </div>
                  <Badge variant="accent" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-[11px]">
                    Lead Author & Maintainer
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>techabbayi</strong> is an independent software engineer, AI systems researcher, and open-source advocate passionate about building privacy-preserving, high-performance web applications and enterprise AI infrastructure.
                </p>
              </div>
            </div>

            {/* Author Contact Details & Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Contact Email</span>
                  <a href="mailto:srssltd@protonmail.com" className="text-xs font-bold text-[#1E3A8A] hover:underline">
                    srssltd@protonmail.com
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Official GitHub</span>
                  <a
                    href="https://github.com/techabbayi/LawPilot-AI"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#1E3A8A] hover:underline truncate block"
                  >
                    github.com/techabbayi/LawPilot-AI
                  </a>
                </div>
              </div>
            </div>

            {/* Author Principles */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Core Engineering Principles</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-[#1E3A8A] block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Privacy By Design
                  </span>
                  <p className="text-[11px] text-slate-600">Zero data retention by default, local memory buffers, and strong encryption.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-[#1E3A8A] block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Open Source First
                  </span>
                  <p className="text-[11px] text-slate-600">Complete code transparency under permissive MIT and Apache 2.0 licenses.</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-[#1E3A8A] block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Vendor Lock-in
                  </span>
                  <p className="text-[11px] text-slate-600">Self-hostable architecture deployable on any air-gapped server or cloud.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Footer Card */}
        <Card className="p-8 bg-gradient-to-r from-[#0F172A] to-blue-950 text-white rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Ready to Experience LawPilot AI?</h3>
            <p className="text-xs text-slate-300">Explore open source governance, start auditing contracts, or self-host your instance.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/oss">
              <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold gap-1.5">
                <Code className="w-4 h-4" /> Open Source Guide
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5">
                <Sparkles className="w-4 h-4" /> Launch App
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
