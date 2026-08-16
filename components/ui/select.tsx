import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-xs font-medium text-[#0F172A]">{label}</label>}
        <select
          ref={ref}
          className={cn(
            "w-full bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-sm text-[#0F172A] transition-all focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none cursor-pointer",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";
