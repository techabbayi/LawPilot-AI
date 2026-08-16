"use client";
export const dynamic = "force-dynamic";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale, Lock, KeyRound, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-slate-200" };
    if (pass.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 10) return { score: 2, label: "Medium", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const passStrength = getPasswordStrength(newPassword);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long");
      return;
    }

    if (!token) {
      setErrorMsg("Missing or invalid password reset authorization token.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Password updated successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorMsg(data.error || "Password reset failed");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Set New Password</h1>
        <p className="text-xs text-[#64748B]">Create a strong password for your LawPilot AI account</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<KeyRound className="w-4 h-4" />}
              required
            />
            {newPassword && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>Password Strength:</span>
                  <span>{passStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${passStrength.color} transition-all duration-300`} style={{ width: `${(passStrength.score / 3) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" size="lg" className="w-full font-semibold bg-[#1E3A8A] hover:bg-blue-900 text-white" isLoading={loading}>
            Update & Save Password <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      )}

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Back to login?</span>
        <Link href="/login" className="text-[#1E3A8A] font-semibold hover:underline">
          Sign In Here
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading password reset authorization...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
