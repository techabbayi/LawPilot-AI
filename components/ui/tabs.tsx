"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => {
  return (
    <div className={cn("flex border-b border-[#E2E8F0] space-x-2 overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 py-2.5 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer",
              isActive
                ? "border-[#1E3A8A] text-[#1E3A8A]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-slate-300"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
