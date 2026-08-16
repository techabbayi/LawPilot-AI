"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled platform error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">System Exception Handled</h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            An isolated component error occurred. All legal documents and user data remain protected under active encryption.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" /> Retry Action
          </Button>
          <Link href="/dashboard">
            <Button size="sm">
              <Home className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
