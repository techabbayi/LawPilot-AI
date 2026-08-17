"use client";
import React from "react";
import Link from "next/link";
import { Scale, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1d4ed8] transition-colors">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#0F172A] tracking-tight leading-none flex items-center gap-1.5">
              LawPilot <span className="text-[10px] bg-[#D4AF37]/20 text-[#0F172A] px-1.5 py-0.5 rounded-full font-semibold border border-[#D4AF37]/40">AI</span>
            </span>
            <span className="text-[10px] text-[#64748B] tracking-wider uppercase">Legal Intelligence</span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
          <Link href="/about" className="hover:text-[#1E3A8A] transition-colors font-semibold">
            About
          </Link>
          <Link href="/features" className="hover:text-[#1E3A8A] transition-colors font-semibold">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-[#1E3A8A] transition-colors font-semibold">
            Pricing
          </Link>
          <Link href="/privacy-first" className="hover:text-[#1E3A8A] transition-colors font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacy First
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="primary" size="sm" className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold gap-1.5">
              <User className="w-3.5 h-3.5" /> Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
