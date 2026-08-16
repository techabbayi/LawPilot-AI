import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">404 - Page Not Found</h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            The legal intelligence record or route you requested does not exist or may have undergone an automated zero-retention hard wipe.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard">
            <Button size="md" className="w-full">
              <ArrowLeft className="w-4 h-4" /> Return to Platform Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
