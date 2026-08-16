"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-blue-400/20 text-blue-200 border-blue-400/30 text-xs px-3 py-1">
            Zero Tracking Privacy Policy
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Cookie & Tracking Policy</h1>
          <p className="text-xs sm:text-sm text-slate-300">LawPilot AI Uses Only Essential Session Cookies</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-6 space-y-6">
        <Card className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#1E3A8A]" /> 1. Essential Authentication Cookies Only
            </h2>
            <p>
              LawPilot AI does NOT use third-party advertising cookies, cross-site tracking scripts, or user profiling analytics. We strictly use HttpOnly session cookies (`lawpilot_token`) necessary to keep your legal workspace session authenticated securely.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 2. Local Storage Preferences
            </h2>
            <p>
              Your browser's local storage (`localStorage`) is used exclusively for non-sensitive UI preference flags, such as notification read states and active theme settings.
            </p>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
