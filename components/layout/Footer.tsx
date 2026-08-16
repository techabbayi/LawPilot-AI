import React from "react";
import Link from "next/link";
import { Scale, ShieldCheck, Lock, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">LawPilot AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Enterprise legal intelligence platform enabling contract auditing, risk detection, multi-provider AI consultation, and automatic zero-retention data privacy.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Support: <strong className="text-white">support@lawpilot.ai</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Legal & Compliance: <strong className="text-white">legal@lawpilot.ai</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Enterprise Legal Tech Tower, Cyber City, Gurugram, India</span>
              </div>
            </div>
          </div>

          {/* Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/analyzer" className="hover:text-white transition-colors">AI Document Analyzer</Link></li>
              <li><Link href="/assistant" className="hover:text-white transition-colors">Legal AI Assistant</Link></li>
              <li><Link href="/comparator" className="hover:text-white transition-colors">Side-by-Side Comparator</Link></li>
              <li><Link href="/generator" className="hover:text-white transition-colors">Contract Generator Studio</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Docs Vault & Hard Delete</Link></li>
              <li><Link href="/research" className="hover:text-white transition-colors">RAG 128D Vector Match</Link></li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy & Zero Retention</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security & AES-256 Encryption</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie & Tracking Policy</Link></li>
              <li><Link href="/oss" className="hover:text-white transition-colors">Open Source (OSS) Community</Link></li>
              <li><Link href="/settings/ai" className="hover:text-white transition-colors">AI Gateway Routing Rules</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Support & Contact</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/support" className="hover:text-white transition-colors">Help Center & Documentation</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support Team</Link></li>
              <li><Link href="/support/status" className="hover:text-white transition-colors">API Gateway System Status</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Razorpay INR Subscriptions</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Account Governance</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LawPilot AI Platform. All rights reserved. Enterprise Legal Intelligence SaaS.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/security" className="hover:text-slate-400">Security Architecture</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
