import React from "react";
import { Scale } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center animate-bounce shadow-md">
        <Scale className="w-6 h-6" />
      </div>
      <p className="text-xs font-semibold text-[#0F172A] tracking-wide">Loading AI Legal Companion Workspace...</p>
    </div>
  );
}
