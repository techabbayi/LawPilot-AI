"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Lock, Mail, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      setError("Registration error. Try again.");
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
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Create LawPilot Account</h1>
          <p className="text-xs text-[#64748B]">Join enterprise legal counsels and compliance teams</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />
          <Input
            label="Work Email Address"
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
          <Button type="submit" size="lg" className="w-full font-semibold bg-[#1E3A8A] hover:bg-blue-900 text-white" isLoading={loading}>
            Complete Registration <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Already registered?</span>
          <Link href="/login" className="text-[#1E3A8A] font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
