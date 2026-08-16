"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Scale, Copy, Check, Sparkles, Loader2, Cpu, FileText } from "lucide-react";

interface ResearchResult {
  topic: string;
  statute: string;
  summary: string;
  recommendedClause: string;
  riskAssessment?: string;
  keyPrecedents?: string[];
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [vectorLoading, setVectorLoading] = useState(false);
  const [customResult, setCustomResult] = useState<ResearchResult | null>(null);
  const [vectorResults, setVectorResults] = useState<any[]>([]);
  const [vectorQuery, setVectorQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>("");

  const initialPrecedents: ResearchResult[] = [
    {
      topic: "Unilateral Indemnification Enforceability",
      statute: "Delaware General Corporation Law § 145 / Restatement (Second) of Contracts § 195",
      summary: "Courts strictly construe unilateral indemnification clauses. Exculpation for gross negligence or willful misconduct is void as against public policy.",
      recommendedClause: "Party A agrees to defend, indemnify, and hold harmless Party B against third-party claims, subject to an aggregate monetary cap equal to 12 months' contract fees.",
      riskAssessment: "high",
      keyPrecedents: ["Graham v. State Farm (Del. 1989)", "Restatement (Second) of Contracts § 195"],
    },
    {
      topic: "Consequential Damage Waivers & Carve-Outs",
      statute: "UCC § 2-719 / Uniform Commercial Code Remedies",
      summary: "Waivers of consequential damages (lost profits, indirect losses) are enforceable unless they fail of their essential purpose. Standard carve-outs include breach of confidentiality and intentional IP infringement.",
      recommendedClause: "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, PROVIDED THAT THIS LIMITATION SHALL NOT APPLY TO BREACHES OF CONFIDENTIALITY OR INDEMNIFICATION OBLIGATIONS.",
      riskAssessment: "medium",
      keyPrecedents: ["Kearney & Trecker Corp. v. Master Engraving Co.", "UCC § 2-719(3) Enforceability Standard"],
    },
    {
      topic: "Restrictive Covenants & Non-Compete Scope",
      statute: "FTC Non-Compete Ban / California Business and Professions Code § 16600",
      summary: "Non-compete covenants are increasingly unenforceable nationwide unless narrowly tailored to protect legitimate trade secret interests with reasonable geographic limitations.",
      recommendedClause: "Employee agrees not to solicit existing company clients or key executive staff for a period of 12 months post-termination.",
      riskAssessment: "critical",
      keyPrecedents: ["Edwards v. Arthur Andersen LLP (Cal. 2008)", "FTC 16 CFR Part 910 Rulemaking"],
    },
  ];

  const handleResearch = async (searchTopic?: string) => {
    const topicToSearch = searchTopic || topicInput || query;
    if (!topicToSearch.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToSearch }),
      });
      const data = await res.json();
      if (data.result) {
        setCustomResult(data.result);
        if (data.providerUsed) setProvider(data.providerUsed);
      }
    } catch (e) {
      console.error("AI Legal research error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleVectorSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSearch = vectorQuery || topicInput || "indemnification aggregate liability cap";
    if (!textToSearch.trim()) return;

    setVectorLoading(true);
    try {
      const res = await fetch("/api/research/vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSearch }),
      });
      const data = await res.json();
      if (data.results) {
        setVectorResults(data.results);
      }
    } catch (err) {
      console.error("Vector search error:", err);
    } finally {
      setVectorLoading(false);
    }
  };

  const copyClause = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = initialPrecedents.filter(
    (p) =>
      p.topic.toLowerCase().includes(query.toLowerCase()) ||
      p.statute.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardWrapper title="Legal Research & RAG Vector Engine">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Research Input & AI Prompt Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">AI Statutory & RAG Vector Research Engine</h2>
                <p className="text-xs text-[#64748B]">Query 128-dimensional dense vector embeddings across your Vault contracts and statutory reference library.</p>
              </div>
            </div>
            {provider && (
              <Badge variant="neutral" className="text-[11px] font-mono">
                AI Gateway: {provider}
              </Badge>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2"
          >
            <div className="relative flex-1 w-full">
              <Input
                placeholder="Ask any statutory topic (e.g. SLA Liquidated Damages, IP Assignment, Indemnification Caps)..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" variant="accent" size="md" isLoading={loading} className="w-full sm:w-auto shrink-0 font-semibold">
              <Sparkles className="w-4 h-4 mr-1.5" /> Run AI Statutory Research
            </Button>
            <Button type="button" onClick={() => handleVectorSearch()} isLoading={vectorLoading} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shrink-0">
              <Cpu className="w-4 h-4 mr-1.5" /> Run RAG 128D Vector Match
            </Button>
          </form>

          {/* Quick Topic Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Suggested Topics:</span>
            {[
              "Unilateral Indemnification",
              "Consequential Damage Waivers",
              "Non-Compete Enforceability",
              "SLA Liquidated Damages",
              "IP Assignment Carve-outs",
              "Force Majeure & Pandemics",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setTopicInput(chip);
                  handleResearch(chip);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1E3A8A] text-slate-600 text-xs font-medium transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Real RAG 128D Vector Similarity Search Results */}
        {vectorResults.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E3A8A] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" /> RAG 128D Dense Vector Similarity Matches ({vectorResults.length} Chunks Matched)
              </h3>
              <button onClick={() => setVectorResults([])} className="text-xs text-slate-400 hover:text-slate-600">
                Clear Vector Results
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vectorResults.map((v, i) => (
                <Card key={i} className="p-4 space-y-2 border border-slate-200 hover:border-blue-300 transition-all bg-white shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F172A] flex items-center gap-1.5 truncate max-w-[220px]">
                      <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" /> {v.docTitle}
                    </span>
                    <Badge variant="info" className="font-mono text-[10px]">
                      Cosine Score: {(v.similarityScore * 100).toFixed(0)}% Match
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    "{v.snippet}"
                  </p>

                  {v.embeddingVector && (
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 overflow-x-auto pt-1">
                      <span className="font-semibold text-slate-500">128D Vector Head:</span>
                      <span>[{v.embeddingVector.join(", ")}...]</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Custom Research Result Output */}
        {loading && (
          <Card className="p-8 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#0F172A]">Conducting AI RAG Statutory & Precedent Analysis...</p>
            <p className="text-xs text-slate-500">Querying statutory legal codes, UCC standards, and judicial precedents.</p>
          </Card>
        )}

        {customResult && !loading && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E3A8A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Legal Research Result
              </h3>
              <button onClick={() => setCustomResult(null)} className="text-xs text-slate-400 hover:text-slate-600">
                Clear Result
              </button>
            </div>

            <Card className="p-6 space-y-5 border-2 border-blue-200 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#1E3A8A]" /> {customResult.topic}
                </h3>
                <Badge variant="info" className="font-mono text-xs">
                  {customResult.statute}
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Statutory Legal Analysis & Enforceability</span>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {customResult.summary}
                </p>
              </div>

              {customResult.keyPrecedents && customResult.keyPrecedents.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Key Judicial Precedents & Doctrines</span>
                  <div className="flex flex-wrap gap-2">
                    {customResult.keyPrecedents.map((prec, i) => (
                      <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium">
                        {prec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A]">Recommended Standard Clause Template</span>
                  <button
                    onClick={() => copyClause("custom", customResult.recommendedClause)}
                    className="text-xs text-slate-500 hover:text-[#1E3A8A] flex items-center gap-1 font-medium"
                  >
                    {copiedId === "custom" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === "custom" ? "Copied!" : "Copy Clause Snippet"}
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
                  "{customResult.recommendedClause}"
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Statutory Reference Library */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">Pre-Audited Statutory Reference Library</h3>
            <div className="max-w-xs">
              <Input
                placeholder="Filter statutory library..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((item, idx) => (
              <Card key={idx} className="p-6 space-y-4 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#1E3A8A]" /> {item.topic}
                  </h3>
                  <Badge variant="info" className="font-mono text-[11px]">
                    {item.statute}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {item.summary}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A]">Recommended Standard Clause</span>
                    <button
                      onClick={() => copyClause(`lib_${idx}`, item.recommendedClause)}
                      className="text-xs text-slate-500 hover:text-[#1E3A8A] flex items-center gap-1 font-medium"
                    >
                      {copiedId === `lib_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === `lib_${idx}` ? "Copied!" : "Copy Clause Snippet"}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs leading-relaxed border border-slate-800">
                    "{item.recommendedClause}"
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
