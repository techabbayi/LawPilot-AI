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
  Code,
  GitBranch,
  GitPullRequest,
  ShieldCheck,
  Star,
  FileCheck2,
  AlertCircle,
  Terminal,
  BookOpen,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldAlert,
  FileText,
  UserCheck,
  Cpu,
  Search,
  FileSearch,
  Layers,
  Sparkles,
  Layout,
  Lock,
  PlusCircle,
  Bug,
  Zap,
} from "lucide-react";

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0F172A] via-blue-950 to-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <Badge variant="accent" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1 gap-1">
            <Code className="w-3.5 h-3.5" /> Community Open Source Architecture
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Open Source Governance & Contributor Guide</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Comprehensive developer instructions, active work areas, regulations, and contribution guidelines for LawPilot AI under MIT and Apache 2.0 licenses.
          </p>

          {/* Top 2 Buttons Only */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <a href="https://github.com/techabbayi/LawPilot-AI" target="_blank" rel="noreferrer">
              <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold gap-1.5 cursor-pointer">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Star on GitHub
              </Button>
            </a>
            <a href="https://github.com/techabbayi/LawPilot-AI/pulls" target="_blank" rel="noreferrer">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 cursor-pointer">
                <GitPullRequest className="w-4 h-4" /> Submit Pull Request
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main OSS Guide & Regulations Content */}
      <section className="py-16 max-w-5xl mx-auto px-6 space-y-10">
        {/* Section 1: Philosophy & Charter */}
        <Card className="p-8 space-y-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">1. Open Source Philosophy & Licensing Charter</h2>
              <p className="text-xs text-slate-500">Permissive licensing guaranteeing zero vendor lock-in and complete code auditing.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed pt-2">
            <p>
              LawPilot AI operates under a dual <strong>MIT License</strong> and <strong>Apache License 2.0</strong> governance model. Our mission is to democratize privacy-preserving legal AI technology by keeping all core routing gateways, vector similarity matchers, and zero-retention algorithms completely open source.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-[#0F172A] block text-xs">Core Guarantees Granted to Developers & Organizations:</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Freedom to inspect, modify, and audit all source code locally.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Permission to self-host and deploy on private air-gapped enterprise clouds.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zero proprietary telemetry or hidden data capture mechanisms.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 2: Comprehensive Rules & Regulations */}
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">2. Community Code of Conduct & Regulations</h2>
              <p className="text-xs text-slate-500">Mandatory standards, behavior expectations, security protocols, and enforcement rules.</p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed pt-2">
            {/* Subsection A: Inclusivity & Positive Behavior */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" /> A. Our Pledge & Expected Professional Behavior
              </h3>
              <p>
                We as maintainers and contributors pledge to make participation in the LawPilot AI open-source ecosystem a harassment-free experience for everyone, regardless of level of experience, gender identity, technical background, or nationality.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-900 block">✔ Encouraged Behaviors</span>
                  <ul className="space-y-1 text-[11px] text-emerald-800">
                    <li>• Using welcoming and inclusive language.</li>
                    <li>• Respecting differing technical viewpoints and legal taxonomies.</li>
                    <li>• Giving and gracefully accepting constructive code reviews.</li>
                    <li>• Demonstrating empathy towards fellow developers and maintainers.</li>
                  </ul>
                </div>

                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                  <span className="font-bold text-red-900 block">✖ Strictly Prohibited Conduct</span>
                  <ul className="space-y-1 text-[11px] text-red-800">
                    <li>• Trolling, insulting, or derogatory personal comments.</li>
                    <li>• Public or private harassment of any community member.</li>
                    <li>• Publishing others' private information without consent (doxxing).</li>
                    <li>• Unsolicited commercial advertising, spamming, or self-promotion.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Subsection B: Responsible Security Disclosure */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> B. Responsible Zero-Day Vulnerability Disclosure Policy
              </h3>
              <p>
                Security is paramount in legal technology. If you discover a critical vulnerability, zero-day flaw, or memory leak in LawPilot AI, do <strong>NOT</strong> create a public GitHub Issue.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 block text-xs">Security Reporting Procedure:</span>
                <ol className="list-decimal pl-5 space-y-1 text-[11px] text-amber-950">
                  <li>Email full details and reproduction steps directly to <strong>srssltd@protonmail.com</strong>.</li>
                  <li>Author <strong>techabbayi</strong> will acknowledge receipt within <strong>12 hours</strong>.</li>
                  <li>Allow a <strong>90-day private patch window</strong> before public disclosure to protect deployed enterprise instances.</li>
                </ol>
              </div>
            </div>

            {/* Subsection C: Enforcement & Sanctions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" /> C. Community Enforcement & Escalation Framework
              </h3>
              <p>
                Instances of abusive, harassing, or unprofessional behavior may be reported directly to project author <strong>techabbayi</strong> at <strong>srssltd@protonmail.com</strong>. Maintainers will enforce the following 3-stage escalation ladder:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-[#0F172A] block">1. Private Warning</span>
                  <p className="text-slate-600 text-[11px]">Private written reprimand clarifying the nature of the violation and expected change.</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-900 block">2. 30-Day Suspension</span>
                  <p className="text-amber-800 text-[11px]">Temporary 30-day ban from interacting with all GitHub organization repositories.</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                  <span className="font-bold text-red-900 block">3. Permanent Ban</span>
                  <p className="text-red-800 text-[11px]">Immediate permanent ban from all organization repositories, chats, and forums.</p>
                </div>
              </div>
            </div>

            {/* Subsection D: Intellectual Property & CLA */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> D. Intellectual Property & DCO Certification
              </h3>
              <p>
                By submitting a Pull Request, you certify under the <strong>Developer Certificate of Origin (DCO 1.1)</strong> that you hold the legal right or explicit employer authorization to submit the code under our MIT/Apache 2.0 licenses.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 3: Detailed Work Areas */}
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">3. Contribution Work Areas & Domain Guidelines</h2>
              <p className="text-xs text-slate-500">Explore technical contribution domains including UI design, security, add-on features, bug fixes, and core functionality.</p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed pt-2">
            {/* Work Area 1: UI & UX Design System */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#1E3A8A]" /> Work Area 1: UI & UX Design System (`components/`, `app/`)
                </h3>
                <Badge variant="info">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">📌 What Needs Contribution:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Enhancing glassmorphism dark/light design systems, Framer Motion micro-animations, accessible ARIA form controls, mobile responsive layouts, and multi-language UI localization.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold font-mono text-[#1E3A8A] block">🛠 How to Contribute:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Modify reusable UI primitives in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">components/ui/</code>. Enforce Lucide React icons exclusively (100% zero raw emojis) and test across viewport sizes.
                  </p>
                </div>
              </div>
            </div>

            {/* Work Area 2: Security & Encryption Hardening */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-700" /> Work Area 2: Security & Encryption Hardening (`lib/auth/`, `middleware.ts`)
                </h3>
                <Badge variant="high">High Priority</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">📌 What Needs Contribution:</span>
                  <p className="text-slate-600 leading-relaxed">
                    AES-256-CBC PBKDF2 cryptographic salt derivations, JWT token rotation, IP rate-limiting algorithms, multi-layer cookie clearances, and automated zero-retention hard wipe protocols.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold font-mono text-[#1E3A8A] block">🛠 How to Contribute:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Enhance security guards in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">middleware.ts</code> and encryption utilities in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">lib/auth/</code>. Verify zero-data leakage.
                  </p>
                </div>
              </div>
            </div>

            {/* Work Area 3: Add-on Features & Community Suggestions */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-purple-700" /> Work Area 3: Add-on Features & Community Suggestions (`app/api/`)
                </h3>
                <Badge variant="accent">Open for Ideas</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">📌 What Needs Contribution:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Third-party webhook integrations (DocuSign, Adobe Sign, Slack notifications), interactive PDF annotation overlays, custom cloud storage connectors (AWS S3, Azure Blob, Google Cloud Storage).
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold font-mono text-[#1E3A8A] block">🛠 How to Contribute:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Propose feature specifications via GitHub Issues, implement Next.js API endpoints in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">app/api/</code>, and include mock event payloads.
                  </p>
                </div>
              </div>
            </div>

            {/* Work Area 4: Bug Fixes & Code Stability */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Bug className="w-4 h-4 text-red-600" /> Work Area 4: Bug Fixes & Code Stability (`lib/`, `app/`)
                </h3>
                <Badge variant="medium">Help Needed</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">📌 What Needs Contribution:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Handling edge-case TypeScript null/undefined checks, resolving PDF parsing timeout exceptions, fixing state synchronization glitches, and expanding automated unit test suites.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold font-mono text-[#1E3A8A] block">🛠 How to Contribute:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Select open bugs labeled <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">bug</code> on GitHub, write a reproduction test case, fix the root cause, and pass <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">npx tsc --noEmit</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Work Area 5: Core Platform Functionality & AI Engines */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" /> Work Area 5: Core Platform Functionality & AI Engines (`lib/ai/`, `lib/ocr/`)
                </h3>
                <Badge variant="neutral">Core Domain</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">📌 What Needs Contribution:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Multi-LLM gateway adapters (Gemini 1.5 Flash, Groq Llama 3.3, DeepSeek R1), 128D RAG dense vector similarity search, Tesseract OCR document extraction, and 52 legal templates.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold font-mono text-[#1E3A8A] block">🛠 How to Contribute:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Extend AI gateway logic in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">lib/ai/gateway.ts</code>, optimize cosine dot product math in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">vectorSearch.ts</code>, or add templates in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">data.ts</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 4: Developer Instructions */}
        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">4. Step-by-Step Developer Setup & Build Instructions</h2>
              <p className="text-xs text-slate-500">Follow these precise commands to set up your local development environment.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Step 1: Clone Repository & Install Dependencies</span>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
                <p># Clone the official repository</p>
                <p className="text-emerald-400">git clone https://github.com/techabbayi/LawPilot-AI.git</p>
                <p className="text-emerald-400">cd LawPilot-AI</p>
                <p># Install Node modules</p>
                <p className="text-emerald-400">npm install --legacy-peer-deps</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Step 2: TypeScript Build Verification</span>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
                <p># Run strict static type checking with 0 errors</p>
                <p className="text-emerald-400">npx tsc --noEmit</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Step 3: Launch Local Development Server</span>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
                <p># Start Next.js App Router on localhost:3000</p>
                <p className="text-emerald-400">npm run dev</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 5: Pull Request Acceptance Rules */}
        <Card className="p-8 space-y-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">5. Pull Request (PR) Acceptance Checklist</h2>
              <p className="text-xs text-slate-500">Every pull request must fulfill these acceptance criteria before being merged into main.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1E3A8A] block">✔ Zero Type & Lint Errors</span>
              <p className="text-slate-600 text-[11px]">All code must pass <code className="bg-slate-200 px-1 py-0.5 rounded">npx tsc --noEmit</code> without warnings.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1E3A8A] block">✔ Vector Icon Policy</span>
              <p className="text-slate-600 text-[11px]">Use <code className="bg-slate-200 px-1 py-0.5 rounded">lucide-react</code> icons exclusively (zero raw emojis).</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1E3A8A] block">✔ Developer Certificate of Origin (DCO)</span>
              <p className="text-slate-600 text-[11px]">Commits must be signed using <code className="bg-slate-200 px-1 py-0.5 rounded">git commit -s</code>.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-[#1E3A8A] block">✔ 24-Hour Review SLA</span>
              <p className="text-slate-600 text-[11px]">Core maintainers review and process all submitted PRs within 24 hours.</p>
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
