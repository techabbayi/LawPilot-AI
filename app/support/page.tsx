"use client";
export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, FileText, Cpu, Mail, Phone, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs px-3 py-1">
            24/7 Legal Tech Support
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">LawPilot AI Help & Documentation Center</h1>
          <p className="text-xs sm:text-sm text-slate-300">Guides, API Gateway setup, document retention troubleshooting, and contact channels.</p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 bg-white border border-slate-200 hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-bold text-[#0F172A]">AI Gateway Setup Guide</CardTitle>
            <CardDescription className="text-xs text-slate-600 leading-relaxed">
              Step-by-step instructions on obtaining and configuring API keys for Google Gemini, Groq, OpenAI, and OpenRouter.
            </CardDescription>
            <Link href="/settings/ai" className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline pt-2">
              Configure AI Gateway →
            </Link>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200 hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-bold text-[#0F172A]">Cascading Hard Delete FAQ</CardTitle>
            <CardDescription className="text-xs text-slate-600 leading-relaxed">
              Learn how zero-retention policies permanently destroy files, vectors, and OCR text from Cloudinary and MongoDB.
            </CardDescription>
            <Link href="/privacy" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2">
              View Privacy Center →
            </Link>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200 hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-bold text-[#0F172A]">Direct Support Ticket</CardTitle>
            <CardDescription className="text-xs text-slate-600 leading-relaxed">
              Need assistance with an enterprise contract or subscription? Contact our legal engineering team directly.
            </CardDescription>
            <Link href="/contact" className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 hover:underline pt-2">
              Open Support Form →
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
