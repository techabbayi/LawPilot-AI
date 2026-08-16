"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Plus, Tag } from "lucide-react";

export const PRESET_LEGAL_CATEGORIES = [
  "General Contract",
  "NDAs & Confidentiality",
  "SaaS & Software Services",
  "Master Services Agreement (MSA)",
  "Employment & Independent Contractor",
  "Commercial Lease & Real Estate",
  "Intellectual Property & Licensing",
  "Mergers & Acquisitions (M&A)",
  "Corporate Governance & Bylaws",
  "Vendor & Procurement Contract",
  "Partnership & Joint Venture",
  "Compliance & Regulatory Policy",
  "Financial & Loan Agreement",
  "Power of Attorney & Estate",
];

interface SearchableCategorySelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const SearchableCategorySelect: React.FC<SearchableCategorySelectProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = PRESET_LEGAL_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (cat: string) => {
    if (cat === "__CUSTOM__") {
      setIsCustomMode(true);
      setIsOpen(false);
    } else {
      setIsCustomMode(false);
      onChange(cat);
      setIsOpen(false);
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputValue.trim()) {
      onChange(customInputValue.trim());
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {isCustomMode ? (
        <form onSubmit={handleSaveCustom} className="flex items-center gap-1.5 bg-white border border-[#1E3A8A] rounded-xl px-3 py-1.5 shadow-xs">
          <Tag className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <input
            type="text"
            value={customInputValue}
            onChange={(e) => setCustomInputValue(e.target.value)}
            placeholder="Type custom category..."
            className="bg-transparent text-xs font-semibold text-[#0F172A] outline-none w-36"
            autoFocus
          />
          <button
            type="submit"
            onClick={() => {
              if (customInputValue.trim()) onChange(customInputValue.trim());
            }}
            className="text-[11px] bg-[#1E3A8A] text-white px-2 py-0.5 rounded font-semibold hover:bg-blue-900"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              onChange("General Contract");
            }}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-bold px-1"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-white hover:border-[#1E3A8A] transition-all min-w-[210px] text-left shadow-xs"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Tag className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
            <span className="truncate">Category: {value || "General Contract"}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150 space-y-2">
          {/* Internal Dedicated Search Input */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal categories..."
              className="bg-transparent text-xs text-[#0F172A] placeholder:text-slate-400 outline-none w-full font-medium"
              autoFocus
            />
          </div>

          {/* Preset Categories List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 text-xs font-medium">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    value === cat ? "bg-blue-50 text-[#1E3A8A] font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {value === cat && <Check className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 italic">No matching categories found.</div>
            )}
          </div>

          {/* Custom Category Button */}
          <div className="pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSelectCategory("__CUSTOM__")}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> + Custom Category (Enter Manually)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
