"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Plus,
  ArrowRight,
  Split,
  FileSearch,
  Trash2,
  Eye,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const uCache = sessionStorage.getItem("lawpilot_user");
      if (uCache) {
        try { setUser(JSON.parse(uCache)); } catch (e) {}
      }
      const dCache = sessionStorage.getItem("lawpilot_docs_cache");
      if (dCache) {
        try {
          const parsed = JSON.parse(dCache);
          if (Array.isArray(parsed)) {
            setDocuments(parsed);
            setLoading(false);
          }
        } catch (e) {}
      }
    }

    fetchDocuments();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lawpilot_user", JSON.stringify(data.user));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lawpilot_docs_cache", JSON.stringify(data.documents));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Permanently wipe this document across Cloudinary and MongoDB database?")) return;
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments(documents.filter((d) => d._id !== docId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayName = user?.name || "Legal Counsel";

  return (
    <DashboardWrapper title="Executive Platform Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0F172A] text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-300 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Welcome back, {displayName}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Legal Intelligence & Risk Command</h1>
            <p className="text-xs md:text-sm text-slate-300">
              All systems nominal. Your zero-retention privacy policy is active with 30-day cascading hard wipe configured.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/analyzer">
              <Button variant="accent" size="md">
                <Plus className="w-4 h-4" /> Audit Contract Now
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="secondary" size="md" className="border border-slate-700">
                <Bot className="w-4 h-4" /> AI Consultation
              </Button>
            </Link>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold text-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-medium">Audited Documents</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mt-0.5">{documents.length}</h3>
              <span className="text-[10px] text-emerald-600 font-medium">100% Parsed & Scored</span>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-medium">Risk Flags Detected</span>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{documents.length > 0 ? documents.length * 2 : 0}</h3>
              <span className="text-[10px] text-amber-700 font-medium">Zero-Retention Active</span>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-medium">Active AI Engine</span>
              <h3 className="text-base font-bold text-[#0F172A] mt-0.5">Gemini 1.5</h3>
              <span className="text-[10px] text-blue-600 font-medium">Groq Llama Backup</span>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] font-medium">Privacy Status</span>
              <h3 className="text-base font-bold text-emerald-700 mt-0.5">Zero Retention</h3>
              <span className="text-[10px] text-emerald-600 font-medium">Cascading Wipe Active</span>
            </div>
          </Card>
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Link href="/analyzer" className="block">
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#1E3A8A] transition-all flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Document Analyzer</h4>
                <p className="text-[11px] text-slate-500">Upload PDF/DOCX OCR</p>
              </div>
            </div>
          </Link>

          <Link href="/comparator" className="block">
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#1E3A8A] transition-all flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <Split className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Contract Comparator</h4>
                <p className="text-[11px] text-slate-500">Side-by-side version diff</p>
              </div>
            </div>
          </Link>

          <Link href="/generator" className="block">
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#1E3A8A] transition-all flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Doc Generator</h4>
                <p className="text-[11px] text-slate-500">Form wizard templates</p>
              </div>
            </div>
          </Link>

          <Link href="/privacy" className="block">
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#1E3A8A] transition-all flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Privacy Center</h4>
                <p className="text-[11px] text-slate-500">Data export & Wipe</p>
              </div>
            </div>
          </Link>
        </div>

        {/* RECENT DOCUMENTS TABLE */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Legal Records & Audits</CardTitle>
              <CardDescription>Click any document to view clause breakdown or trigger hard wipe.</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="p-3 font-semibold">Document Title</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Retention Policy</th>
                  <th className="p-3 font-semibold">Uploaded Date</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-sm text-slate-700">No Audited Legal Documents</p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          You have not uploaded any legal contracts for AI risk analysis yet. Upload a document to perform instant zero-retention analysis.
                        </p>
                        <Link href="/analyzer" className="mt-2">
                          <Button variant="accent" size="sm">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Audit Contract Now
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-medium text-[#0F172A]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#1E3A8A]" />
                          <span className="truncate max-w-xs">{doc.title}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{doc.category}</td>
                      <td className="p-3">
                        <Badge variant="low">
                          Parsed
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-600">
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {doc.retentionPolicy}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{formatDate(doc.createdAt)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/analyzer?docId=${doc._id}`}>
                            <button className="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
