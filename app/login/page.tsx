"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err: any) {
      setError("Login failed. Please check your network connection.");
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
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Sign In to LawPilot AI</h1>
          <p className="text-xs text-[#64748B]">Enterprise Legal Intelligence & Risk Command SaaS</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#1E3A8A]" />
              Remember credentials
            </label>
            <Link href="/forgot-password" className="text-[#1E3A8A] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full font-semibold bg-[#1E3A8A] hover:bg-blue-900 text-white" isLoading={loading}>
            Sign In to Workspace <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Don't have an enterprise account?</span>
          <Link href="/signup" className="text-[#1E3A8A] font-semibold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
