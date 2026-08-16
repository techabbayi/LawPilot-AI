"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Key, Server, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1">
            AES-256 Cryptographic Architecture
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Security & Encryption Whitepaper</h1>
          <p className="text-xs sm:text-sm text-slate-300">Bank-Grade Protection for Corporate Legal Data</p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3 bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Per-User API Key Encryption</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              API keys entered in the AI Gateway (/settings/ai) are encrypted using AES-256-CBC cipher with PBKDF2 salt derivation. Keys are decrypted strictly in-memory during single-request API calls.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Cascading Zero-Retention Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Documents scheduled for hard deletion undergo automated cascading wipes across MongoDB Atlas collections, Cloudinary PDF/DOCX storage buckets, and dense RAG vector indices.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">JWT HttpOnly Cookie Authentication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sessions use signed JSON Web Tokens (JWT) stored in Secure, SameSite=Lax, HttpOnly cookies, protecting your session against XSS and token exfiltration attacks.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Immutable Security Audit Trail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every key update, contract audit, vector search, and deletion request is logged into an immutable audit log database with IP timestamps.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
