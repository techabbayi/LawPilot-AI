"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { Scale, Mail, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [directResetLink, setDirectResetLink] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setDirectResetLink("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Password reset instructions sent to your email!");
        if (data.resetLink) {
          setDirectResetLink(data.resetLink);
        }
      } else {
        setErrorMsg(data.error || "Failed to process request");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Reset Account Password</h1>
          <p className="text-xs text-[#64748B]">Enter your email address to receive password reset instructions</p>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            {directResetLink && (
              <div className="pt-2 border-t border-emerald-200/60 space-y-1">
                <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">Direct Access Reset Link:</span>
                <Link
                  href={directResetLink}
                  className="text-xs font-bold text-[#1E3A8A] underline break-all flex items-center gap-1 hover:text-blue-900"
                >
                  <KeyRound className="w-3.5 h-3.5 shrink-0" /> Click to Reset Password Now →
                </Link>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            {errorMsg}
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Button type="submit" size="lg" className="w-full font-semibold bg-[#1E3A8A] hover:bg-blue-900 text-white" isLoading={loading}>
              Send Reset Authorization <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Remembered your password?</span>
          <Link href="/login" className="text-[#1E3A8A] font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
