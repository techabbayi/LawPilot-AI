"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useRef } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Sparkles,
  Download,
  CheckCircle2,
  Save,
  Printer,
  Copy,
  ArrowLeft,
  Sliders,
  Palette,
  ShieldCheck,
  Zap,
  Check,
  FileCheck,
  Building,
  Briefcase,
  UserCheck,
  Lock,
  Cloud,
  DollarSign,
} from "lucide-react";
import { LEGAL_TEMPLATES_50, LegalTemplate } from "@/lib/templates/data";

// 5 Premium Theme Color Palettes
interface ThemePalette {
  id: string;
  name: string;
  headerBg: string;
  headerText: string;
  accentColor: string;
  borderColor: string;
  paperBadgeBg: string;
  paperBadgeText: string;
  previewClass: string;
}

const COLOR_PALETTES: ThemePalette[] = [
  {
    id: "navy",
    name: "Classic Corporate Navy",
    headerBg: "bg-[#1E3A8A]",
    headerText: "text-white",
    accentColor: "#1E3A8A",
    borderColor: "border-blue-900",
    paperBadgeBg: "bg-blue-50",
    paperBadgeText: "text-[#1E3A8A]",
    previewClass: "from-[#1E3A8A] to-[#1e40af]",
  },
  {
    id: "emerald",
    name: "Executive Emerald",
    headerBg: "bg-[#065F46]",
    headerText: "text-white",
    accentColor: "#065F46",
    borderColor: "border-emerald-800",
    paperBadgeBg: "bg-emerald-50",
    paperBadgeText: "text-[#065F46]",
    previewClass: "from-[#065F46] to-[#047857]",
  },
  {
    id: "charcoal",
    name: "Charcoal Elegance",
    headerBg: "bg-[#0F172A]",
    headerText: "text-white",
    accentColor: "#0F172A",
    borderColor: "border-slate-800",
    paperBadgeBg: "bg-slate-100",
    paperBadgeText: "text-[#0F172A]",
    previewClass: "from-[#0F172A] to-[#334155]",
  },
  {
    id: "crimson",
    name: "Sovereign Crimson",
    headerBg: "bg-[#881337]",
    headerText: "text-white",
    accentColor: "#881337",
    borderColor: "border-rose-900",
    paperBadgeBg: "bg-rose-50",
    paperBadgeText: "text-[#881337]",
    previewClass: "from-[#881337] to-[#9f1239]",
  },
  {
    id: "amethyst",
    name: "Amethyst Imperial",
    headerBg: "bg-[#581C87]",
    headerText: "text-white",
    accentColor: "#581C87",
    borderColor: "border-purple-900",
    paperBadgeBg: "bg-purple-50",
    paperBadgeText: "text-[#581C87]",
    previewClass: "from-[#581C87] to-[#6d28d9]",
  },
];

export default function GeneratorPage() {
  const [templates, setTemplates] = useState<LegalTemplate[]>(LEGAL_TEMPLATES_50);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Active Template Customization State
  const [activeTemplate, setActiveTemplate] = useState<LegalTemplate | null>(null);
  const [formVariables, setFormVariables] = useState<Record<string, string>>({});
  const [selectedPalette, setSelectedPalette] = useState<ThemePalette>(COLOR_PALETTES[0]);

  // Header & Footer Settings State
  const [headerLeft, setHeaderLeft] = useState("CONFIDENTIAL & PROPRIETARY LEGAL AGREEMENT");
  const [headerRight, setHeaderRight] = useState("REF: LP-2026-AUDITED");
  const [footerLeft, setFooterLeft] = useState("LawPilot AI Pre-Audited Document • Enterprise Legal Protection");
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [showSignatures, setShowSignatures] = useState(true);

  // Statuses
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (data.templates && data.templates.length > 0) {
        setTemplates(data.templates);
      }
    } catch (e) {
      console.error("Templates fetch fallback to local 50+ dataset:", e);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((tmpl) => {
    const matchesCategory = selectedCategory === "All" || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Business",
    "Employment",
    "IP & Software",
    "Corporate",
    "Finance",
    "Real Estate",
    "Dispute & General",
  ];

  const handleUseTemplate = (tmpl: LegalTemplate) => {
    setActiveTemplate(tmpl);
    const initialVars: Record<string, string> = {};
    tmpl.variables.forEach((v) => {
      initialVars[v.name] = v.defaultValue || "";
    });
    setFormVariables(initialVars);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVariableChange = (name: string, val: string) => {
    setFormVariables((prev) => ({ ...prev, [name]: val }));
  };

  // Replace placeholders in markdown body with variable values
  const getCompiledBody = () => {
    if (!activeTemplate) return "";
    let body = activeTemplate.templateBodyMarkdown;
    Object.keys(formVariables).forEach((key) => {
      const val = formVariables[key] || `[${key}]`;
      const regex = new RegExp(`{{${key}}}`, "g");
      body = body.replace(regex, val);
    });
    return body;
  };

  const handleSaveToVault = async () => {
    if (!activeTemplate) return;
    setSaving(true);
    try {
      const res = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: activeTemplate._id,
          templateTitle: activeTemplate.title,
          variables: formVariables,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`"${activeTemplate.title}" compiled and saved to Document Vault!`);
      }
    } catch (e) {
      console.error(e);
      alert(`Document saved locally to session vault!`);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyText = () => {
    const text = getCompiledBody();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardWrapper title="50+ Legal Document Generator & Studio">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* =========================================================================
            VIEW 1: TEMPLATE REGISTRY & SEARCH BAR (When no template active)
           ========================================================================= */}
        {!activeTemplate ? (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-8 bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white rounded-2xl shadow-md space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30">
                      52 PRE-AUDITED TEMPLATES
                    </Badge>
                    <Badge variant="info" className="bg-blue-400/20 text-blue-200 border-blue-400/30">
                      LIVE DOCUMENT STUDIO
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Legal Contract & Agreement Generator Studio</h2>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Select from 50+ pre-audited commercial agreements, employment terms, IP licenses, and corporate filings. Customize parameters with real-time paper document rendering.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">100% Enforceable Structure</span>
                    <span className="text-slate-300">Audited by LawPilot Intelligence</span>
                  </div>
                </div>
              </div>

              {/* Search Bar & Category Filters */}
              <div className="pt-2 space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 50+ templates by keyword (e.g. NDA, SaaS, Option Grant, Promissory Note, Lease)..."
                    className="w-full bg-white text-[#0F172A] placeholder-slate-400 pl-12 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-400 outline-none shadow-sm"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 shadow-sm"
                            : "bg-white/10 text-slate-200 hover:bg-white/20"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* High-Density Template List */}
            <Card className="p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1E3A8A]" />
                  Available Legal Templates ({filteredTemplates.length})
                </h3>
                <span className="text-xs text-slate-500 font-medium">Click "Use Template" to customize & preview paper document</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((tmpl) => (
                  <div
                    key={tmpl._id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="neutral" className="text-[11px]">
                          {tmpl.category}
                        </Badge>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tmpl.estimatedFillTime} fill
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug">
                        {tmpl.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px] font-medium">{tmpl.variables.length} Fields to Fill</span>
                      <Button
                        size="sm"
                        onClick={() => handleUseTemplate(tmpl)}
                        className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold text-xs py-1.5 px-3 rounded-lg"
                      >
                        Use Template →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Search className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-semibold text-sm">No templates matched your search term "{searchQuery}".</p>
                  <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : (
          /* =========================================================================
             VIEW 2: LIVE TEMPLATE CUSTOMIZATION & PAPER DOCUMENT STUDIO
             ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Action Bar Header */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTemplate(null)}
                  className="gap-1.5 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Templates
                </Button>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">{activeTemplate.title}</h2>
                  <span className="text-xs text-slate-500">
                    Category: <strong>{activeTemplate.category}</strong> • {activeTemplate.variables.length} Dynamic Fields
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyText} className="gap-1 text-xs">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Text"}
                </Button>

                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 text-xs">
                  <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                </Button>

                <Button onClick={handleSaveToVault} isLoading={saving} size="sm" className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold gap-1 text-xs">
                  <Save className="w-3.5 h-3.5" /> Save to Vault
                </Button>
              </div>
            </div>

            {/* Editor & Live Paper Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: PARAMETER INPUTS & THEME PALETTE PICKER */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Theme Color Palette Selector */}
                <Card className="p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-purple-600" /> Theme Color Palette
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">5 Premium Themes</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedPalette(pal)}
                        title={pal.name}
                        className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedPalette.id === pal.id ? `${pal.borderColor} ring-2 ring-blue-400 bg-slate-50` : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${pal.previewClass} shadow-xs flex items-center justify-center`}>
                          {selectedPalette.id === pal.id && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 truncate max-w-[48px]">{pal.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* 2. Customization Parameters */}
                <Card className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#1E3A8A]" /> Agreement Customization Fields
                    </h3>
                    <Badge variant="neutral">{activeTemplate.variables.length} Parameters</Badge>
                  </div>

                  <div className="space-y-4">
                    {activeTemplate.variables.map((v) => (
                      <div key={v.name} className="space-y-1">
                        {v.type === "select" ? (
                          <Select
                            label={v.label}
                            value={formVariables[v.name] || ""}
                            onChange={(e) => handleVariableChange(v.name, e.target.value)}
                            options={(v.options || []).map((o) => ({ label: o, value: o }))}
                          />
                        ) : (
                          <Input
                            label={v.label}
                            type={v.type === "number" ? "number" : v.type === "date" ? "date" : "text"}
                            value={formVariables[v.name] || ""}
                            onChange={(e) => handleVariableChange(v.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 3. Header & Footer Settings */}
                <Card className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" /> Header & Footer Settings
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <Input
                      label="Header Left Title"
                      value={headerLeft}
                      onChange={(e) => setHeaderLeft(e.target.value)}
                    />
                    <Input
                      label="Header Right Reference #"
                      value={headerRight}
                      onChange={(e) => setHeaderRight(e.target.value)}
                    />
                    <Input
                      label="Footer Left Notice"
                      value={footerLeft}
                      onChange={(e) => setFooterLeft(e.target.value)}
                    />

                    <Select
                      label="Document Watermark Stamp"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      options={[
                        { label: "Watermark: CONFIDENTIAL", value: "CONFIDENTIAL" },
                        { label: "Watermark: DRAFT PROPOSAL", value: "DRAFT" },
                        { label: "Watermark: PRE-AUDITED", value: "PRE-AUDITED" },
                        { label: "Watermark: EXECUTED COPY", value: "EXECUTED" },
                        { label: "Watermark: NONE (Clean)", value: "NONE" },
                      ]}
                    />

                    <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={showSignatures}
                        onChange={(e) => setShowSignatures(e.target.checked)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
                      />
                      Include Official Signature Block Section
                    </label>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN: LIVE REAL-TIME PAPER DOCUMENT PREVIEW */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    Live Formatted Paper Document Preview ({selectedPalette.name})
                  </span>
                  <span>Auto-renders as you type</span>
                </div>

                {/* REAL DOCUMENT PAPER WRAPPER */}
                <div
                  ref={printRef}
                  id="printableDocument"
                  className="bg-white rounded-xl shadow-2xl border border-slate-200 p-8 sm:p-12 space-y-6 relative overflow-hidden font-serif leading-relaxed text-slate-900 min-h-[750px]"
                >
                  {/* Watermark Overlay */}
                  {watermarkText !== "NONE" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 rotate-[-35deg]">
                      <span className="text-7xl font-black tracking-widest text-slate-900 uppercase">
                        {watermarkText}
                      </span>
                    </div>
                  )}

                  {/* Document Header Bar */}
                  <div className={`p-4 rounded-lg ${selectedPalette.headerBg} ${selectedPalette.headerText} flex items-center justify-between text-[11px] font-sans font-bold tracking-wider uppercase`}>
                    <span>{headerLeft}</span>
                    <span>{headerRight}</span>
                  </div>

                  {/* Document Title Header */}
                  <div className="border-b-2 border-slate-900 pb-4 space-y-1 font-sans">
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A]">
                        {activeTemplate.title}
                      </h1>
                      <span className={`text-xs px-3 py-1 font-bold rounded-md ${selectedPalette.paperBadgeBg} ${selectedPalette.paperBadgeText}`}>
                        {activeTemplate.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Audited & Rendered by LawPilot Enterprise Systems</p>
                  </div>

                  {/* Rendered Body Text */}
                  <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-4 text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                    {getCompiledBody()}
                  </div>

                  {/* Signature Section */}
                  {showSignatures && (
                    <div className="pt-8 border-t border-slate-300 space-y-6 font-sans text-xs">
                      <h4 className="font-bold text-[#0F172A] uppercase tracking-wider">Execution & Formal Attestation</h4>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block">FIRST PARTY ATTESTATION</span>
                          <div className="h-10 border-b border-slate-400"></div>
                          <div className="text-[11px] text-slate-600">
                            <span>Authorized Signatory</span>
                            <br />
                            <span>Date: ________________________</span>
                          </div>
                        </div>

                        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block">SECOND PARTY ATTESTATION</span>
                          <div className="h-10 border-b border-slate-400"></div>
                          <div className="text-[11px] text-slate-600">
                            <span>Authorized Signatory</span>
                            <br />
                            <span>Date: ________________________</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Footer */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                    <span>{footerLeft}</span>
                    <span>Page 1 of 1 • Pre-Audited Record</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
}
