import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-xs font-medium text-[#0F172A]">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-slate-400 pointer-events-none">{icon}</div>}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none",
              icon && "pl-9",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
