"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useRef } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Split, Sparkles, UploadCloud, Plus, FilePlus, CheckCircle2, Download } from "lucide-react";
import { IContractComparison } from "@/lib/types";

export default function ComparatorPage() {
  const [docAId, setDocAId] = useState("");
  const [docBId, setDocBId] = useState("");
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [comparison, setComparison] = useState<IContractComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<"A" | "B" | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  const fileInputRefA = useRef<HTMLInputElement>(null);
  const fileInputRefB = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.documents && data.documents.length > 0) {
        setAvailableDocs(data.documents);
        if (data.documents.length >= 2) {
          setDocAId((prev) => prev || data.documents[0]._id);
          setDocBId((prev) => prev || data.documents[1]._id);
        } else if (data.documents.length === 1) {
          setDocAId((prev) => prev || data.documents[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompare = async () => {
    if (!docAId || !docBId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comparator?docA=${docAId}&docB=${docBId}`);
      const data = await res.json();
      if (data.comparison) setComparison(data.comparison);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInlineFileUpload = async (target: "A" | "B", file: File) => {
    setUploadingTarget(target);
    setUploadSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "Comparison Document");
    formData.append("retentionPolicy", "30d");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.document) {
        const newDoc = data.document;
        setAvailableDocs((prev) => [newDoc, ...prev]);

        if (target === "A") {
          setDocAId(newDoc._id);
        } else {
          setDocBId(newDoc._id);
        }

        setUploadSuccessMsg(`Successfully uploaded & attached "${newDoc.title}" to Option ${target}!`);
        setTimeout(() => setUploadSuccessMsg(""), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleSelectChange = (target: "A" | "B", val: string) => {
    if (val === "__UPLOAD_NEW__") {
      if (target === "A") fileInputRefA.current?.click();
      else fileInputRefB.current?.click();
      return;
    }

    if (target === "A") setDocAId(val);
    else setDocBId(val);
  };

  return (
    <DashboardWrapper title="Contract Comparator & Redline Diff">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRefA}
        className="hidden"
        accept=".pdf,.docx,.txt"
        onChange={(e) => {
          if (e.target.files?.[0]) handleInlineFileUpload("A", e.target.files[0]);
        }}
      />
      <input
        type="file"
        ref={fileInputRefB}
        className="hidden"
        accept=".pdf,.docx,.txt"
        onChange={(e) => {
          if (e.target.files?.[0]) handleInlineFileUpload("B", e.target.files[0]);
        }}
      />

      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Callout Quick Upload Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-[#0F172A] text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-400 shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Need to compare a new contract version?</h3>
              <p className="text-xs text-slate-300">Upload File A or File B directly to parse OCR & trigger an automated redline comparison.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => fileInputRefA.current?.click()}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Upload Option A
            </Button>
            <Button
              size="sm"
              onClick={() => fileInputRefB.current?.click()}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Upload Option B
            </Button>
          </div>
        </div>

        {uploadSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {uploadSuccessMsg}
            </span>
            <Button size="sm" onClick={handleCompare} isLoading={loading} disabled={!docAId || !docBId}>
              Compare Now
            </Button>
          </div>
        )}

        <Card className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Split className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Side-by-Side Contract Comparator</h2>
                <p className="text-xs text-[#64748B]">Select two agreement versions to audit liability differences and clause changes.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {comparison && (
                <Button variant="outline" onClick={async () => {
                  if (!comparison) return;
                  try {
                    const docA = availableDocs.find((d) => d._id === docAId);
                    const docB = availableDocs.find((d) => d._id === docBId);
                    const res = await fetch("/api/export/redline", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        titleA: docA?.title || "Option A",
                        titleB: docB?.title || "Option B",
                        diffs: comparison.keyDifferences,
                      }),
                    });
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `LawPilot_Redline_Markup_${Date.now()}.doc`;
                    a.click();
                  } catch (e) {
                    console.error(e);
                  }
                }} className="border-purple-200 text-purple-900 hover:bg-purple-50 font-semibold gap-1 text-xs">
                  <Download className="w-3.5 h-3.5" /> Export Word Redline (.doc)
                </Button>
              )}
              <Button onClick={handleCompare} isLoading={loading} disabled={!docAId || !docBId || docAId === docBId}>
                Execute Side-by-Side Comparison
              </Button>
            </div>
          </div>

          {/* Selectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Option A Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider block">
                  Contract Option A (Baseline)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRefA.current?.click()}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload File A
                </button>
              </div>

              <select
                value={docAId}
                onChange={(e) => handleSelectChange("A", e.target.value)}
                disabled={uploadingTarget === "A"}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-[#0F172A] focus:border-[#1E3A8A] outline-none font-medium"
              >
                {availableDocs.length === 0 ? (
                  <option value="">No documents uploaded yet</option>
                ) : (
                  availableDocs.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.title} ({doc.category})
                    </option>
                  ))
                )}
                <option value="__UPLOAD_NEW__" className="text-blue-700 font-bold bg-blue-50">
                  + Upload a new document to compare...
                </option>
              </select>

              {uploadingTarget === "A" && (
                <p className="text-xs text-blue-600 font-medium animate-pulse">Uploading and parsing Option A...</p>
              )}
            </div>

            {/* Option B Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-purple-900 uppercase tracking-wider block">
                  Contract Option B (Comparison)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRefB.current?.click()}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload File B
                </button>
              </div>

              <select
                value={docBId}
                onChange={(e) => handleSelectChange("B", e.target.value)}
                disabled={uploadingTarget === "B"}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-[#0F172A] focus:border-[#1E3A8A] outline-none font-medium"
              >
                {availableDocs.length === 0 ? (
                  <option value="">No documents uploaded yet</option>
                ) : (
                  availableDocs.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.title} ({doc.category})
                    </option>
                  ))
                )}
                <option value="__UPLOAD_NEW__" className="text-purple-700 font-bold bg-purple-50">
                  + Upload a new document to compare...
                </option>
              </select>

              {uploadingTarget === "B" && (
                <p className="text-xs text-purple-600 font-medium animate-pulse">Uploading and parsing Option B...</p>
              )}
            </div>
          </div>

          {/* Quick Upload Callout Box */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm">No document listed that you want to compare?</h4>
                <p className="text-slate-300">
                  Upload a document now to compare side-by-side (PDF, DOCX, TXT, PNG/JPG image).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                onClick={() => fileInputRefA.current?.click()}
                disabled={uploadingTarget !== null}
              >
                <FilePlus className="w-3.5 h-3.5 mr-1" /> Upload Doc A
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                onClick={() => fileInputRefB.current?.click()}
                disabled={uploadingTarget !== null}
              >
                <FilePlus className="w-3.5 h-3.5 mr-1" /> Upload Doc B
              </Button>
            </div>
          </div>
        </Card>

        {comparison && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Comparator Risk Recommendation
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {comparison.riskDelta === "docA_safer" ? "Option A Provides Safer Liability Protections" : "Option B Provides Greater Flexibility"}
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-1">{comparison.summary}</p>
              </div>
              <Badge variant="accent" className="text-sm px-4 py-2 hidden sm:inline-flex">
                RECOMMENDED CHOICE
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clause-by-Clause Divergence Matrix</CardTitle>
                <CardDescription>Direct comparative analysis of key contractual provisions.</CardDescription>
              </CardHeader>

              <div className="divide-y divide-slate-200">
                {comparison.keyDifferences.map((diff, i) => (
                  <div key={i} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">{diff.clauseCategory}</span>
                      <Badge variant={diff.winner === "docA" ? "info" : "accent"}>
                        Winner: {diff.winner === "docA" ? "Option A" : "Option B"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${diff.winner === "docA" ? "bg-blue-50/70 border-blue-200 text-blue-950" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                        <span className="font-bold text-[#1E3A8A] block">Option A Provision:</span>
                        <p>"{diff.docAText}"</p>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${diff.winner === "docB" ? "bg-amber-50/70 border-amber-200 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                        <span className="font-bold text-amber-900 block">Option B Provision:</span>
                        <p>"{diff.docBText}"</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-800 font-medium border border-slate-200">
                      <strong>Comparative Risk Analysis:</strong> {diff.analysis}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
}
