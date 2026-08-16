"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SearchableCategorySelect } from "@/components/ui/SearchableCategorySelect";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  Download,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { IAnalysis, IDocument } from "@/lib/types";

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get("docId");

  const [selectedDocId, setSelectedDocId] = useState<string>(docIdParam || "");
  const [document, setDocument] = useState<IDocument | null>(null);
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState("General");
  const [retentionPolicy, setRetentionPolicy] = useState("30d");

  useEffect(() => {
    if (selectedDocId) fetchAnalysis(selectedDocId);
  }, [selectedDocId]);

  const fetchAnalysis = async (docId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/${docId}`);
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
      const docRes = await fetch(`/api/documents/${docId}`);
      const docData = await docRes.json();
      if (docData.document) {
        setDocument(docData.document);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("retentionPolicy", retentionPolicy);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.document) {
        setDocument(data.document);
        setAnalysis(data.analysis);
        setSelectedDocId(data.document._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Upload & Dropzone Header */}
      <Card className="bg-gradient-to-b from-white to-slate-50 border-2 border-dashed border-[#E2E8F0] p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#0F172A]">Upload Legal Document for AI Clause & Risk Audit</h2>
          <p className="text-xs text-[#64748B]">Supports PDF, DOCX, Scanned Image OCR (PNG/JPG), and Text files.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-w-md mx-auto pt-2">
          <SearchableCategorySelect value={category} onChange={setCategory} />
          <Select
            options={[
              { label: "Retention: Immediate Wipe", value: "immediate" },
              { label: "Retention: 24 Hours", value: "24h" },
              { label: "Retention: 7 Days", value: "7d" },
              { label: "Retention: 30 Days (Default)", value: "30d" },
              { label: "Retention: 90 Days", value: "90d" },
              { label: "Retention: Permanent Keep", value: "keep" },
            ]}
            value={retentionPolicy}
            onChange={(e) => setRetentionPolicy(e.target.value)}
          />
        </div>

        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg shadow-sm transition-all">
            {uploading ? "Parsing & Running OCR..." : "Select File & Execute Audit"}
            <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" className="hidden" disabled={uploading} />
          </label>
        </div>
      </Card>

      <p className="text-xs text-slate-500 text-center font-medium flex items-center justify-center gap-1.5 -mt-4">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span><strong>Retention Policy:</strong> Sets the automatic countdown duration before your uploaded contract undergoes a permanent cascading hard wipe from database and cloud storage.</span>
      </p>

      {/* ANALYSIS DASHBOARD */}
      {analysis && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4 flex flex-col justify-between p-6 bg-white">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Overall Risk Rating</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-[#0F172A]">{analysis.overallRiskScore}</span>
                  <span className="text-sm font-bold text-slate-400">/ 100 Risk Score</span>
                </div>
                <Badge variant={analysis.overallRiskLevel} className="text-sm px-3 py-1">
                  {analysis.overallRiskLevel.toUpperCase()} RISK LEVEL
                </Badge>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Document Title:</span>
                  <strong className="text-[#0F172A] truncate max-w-[180px]">{document?.title || "Master SaaS Agreement"}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Detected Clauses:</span>
                  <strong className="text-[#0F172A]">{analysis.detectedClauses.length} Provisions</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Missing Clauses:</span>
                  <strong className="text-amber-600">{analysis.missingClauses.length} Covenants</strong>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-8 p-6 space-y-4">
              <CardHeader className="p-0 pb-3 border-none">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" /> Executive Legal Summary
                </CardTitle>
              </CardHeader>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {analysis.executiveSummary}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Actionable Recommendations</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {analysis.actionableRecommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Identified Legal Clauses & Risk Breakdown</CardTitle>
                <CardDescription>Structured analysis of core liability, indemnification, and operational covenants.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = window.document.createElement("a");
                  a.href = url;
                  a.download = `LawPilot_Analysis_${analysis.documentId}.json`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4" /> Export Report JSON
              </Button>
            </CardHeader>

            <div className="divide-y divide-slate-200">
              {analysis.detectedClauses.map((clause) => (
                <div key={clause.id} className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Badge variant="neutral">{clause.clauseType}</Badge>
                      <h4 className="text-base font-bold text-[#0F172A]">{clause.title}</h4>
                    </div>
                    <Badge variant={clause.riskLevel}>{clause.riskLevel.toUpperCase()} RISK</Badge>
                  </div>

                  <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 leading-relaxed border border-slate-200">
                    "{clause.originalText}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="font-semibold text-slate-500 block mb-1">Simplified Explanation:</span>
                      <p className="text-slate-700 leading-relaxed">{clause.simplifiedExplanation}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[#1E3A8A] block mb-1">Actionable Renegotiation Strategy:</span>
                      <p className="text-slate-800 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 leading-relaxed">
                        {clause.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <DashboardWrapper title="AI Document Clause Analyzer & Risk Meter">
      <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading clause analyzer...</div>}>
        <AnalyzerContent />
      </Suspense>
    </DashboardWrapper>
  );
}
