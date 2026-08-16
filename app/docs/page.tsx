"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SearchableCategorySelect } from "@/components/ui/SearchableCategorySelect";
import {
  FolderLock,
  Search,
  FileText,
  Trash2,
  Eye,
  Download,
  ShieldCheck,
  Clock,
  List,
  LayoutGrid,
  FolderTree,
  Edit,
  ExternalLink,
  FileSearch,
  Split,
  Plus,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import { IDocument } from "@/lib/types";

type ViewMode = "list" | "grid" | "category";

export default function DocsPage() {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [allDocs, setAllDocs] = useState<IDocument[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [previewDoc, setPreviewDoc] = useState<IDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<IDocument | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editRetention, setEditRetention] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cache = sessionStorage.getItem("lawpilot_docs_cache");
      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          if (Array.isArray(parsed)) {
            setAllDocs(parsed);
            setDocuments(parsed);
            setLoading(false);
          }
        } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [activeCategory, searchQuery]);

  const fetchDocs = async () => {
    try {
      const url = `/api/documents?category=${encodeURIComponent(activeCategory)}&q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
        if (activeCategory === "All" && !searchQuery) {
          setAllDocs(data.documents);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("lawpilot_docs_cache", JSON.stringify(data.documents));
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically extract ONLY existing document categories (No non-existing category tabs)
  const existingCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    allDocs.forEach((doc) => {
      const cat = doc.category?.trim() || "General";
      cats.add(cat);
    });
    return Array.from(cats);
  }, [allDocs]);

  const handleHardDelete = async (docId: string) => {
    if (!confirm("Confirm Cascading Hard Wipe: This action permanently deletes the file from Cloudinary storage and purges all database records.")) return;

    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d._id !== docId));
        setAllDocs((prev) => prev.filter((d) => d._id !== docId));
        if (previewDoc?._id === docId) setPreviewDoc(null);
        if (editingDoc?._id === docId) setEditingDoc(null);
        fetchDocs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (doc: IDocument) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditCategory(doc.category || "General");
    setEditRetention(doc.retentionPolicy || "30d");
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/documents/${editingDoc._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          retentionPolicy: editRetention,
        }),
      });

      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d._id === editingDoc._id ? { ...d, title: editTitle, category: editCategory, retentionPolicy: editRetention as any } : d))
        );
        setEditingDoc(null);
        fetchDocs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingEdit(false);
    }
  };

  // Grouping for category-wise view
  const categoryGroups: Record<string, IDocument[]> = {};
  documents.forEach((doc) => {
    const cat = doc.category || "General";
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(doc);
  });

  return (
    <DashboardWrapper title="Secured Documents & Vault Records">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Secured Documents & Vault Repository</h2>
              <p className="text-xs text-[#64748B]">View, open, edit, or hard purge all platform uploaded & generated legal documents.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="info" className="gap-1 py-1.5 px-3">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> AES-256 Encrypted Storage
            </Badge>

            <Link href="/analyzer">
              <Button size="sm" className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Upload Document
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & View Mode Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Dynamic Category Tabs: ONLY existing categories are rendered */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {existingCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#1E3A8A] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & View Mode Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search documents by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* 3 View Mode Selector Buttons */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
              <button
                onClick={() => setViewMode("list")}
                title="List Table View"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "list" ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                title="Grid Cards View"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "grid" ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode("category")}
                title="Category Grouped View"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "category" ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span className="hidden sm:inline">Categories</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            VIEW MODE 1: LIST TABLE VIEW
           ========================================================================= */}
        {viewMode === "list" && (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#0F172A] font-bold uppercase tracking-wider">
                    <th className="p-4">Document Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Retention</th>
                    <th className="p-4">Date Uploaded</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-[#0F172A]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block truncate max-w-xs">{doc.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{doc.fileName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="neutral">{doc.category || "General"}</Badge>
                      </td>
                      <td className="p-4 font-mono">{formatFileSize(doc.sizeBytes)}</td>
                      <td className="p-4 font-mono text-[11px]">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {doc.retentionPolicy}
                        </span>
                      </td>
                      <td className="p-4">{formatDate(doc.createdAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50"
                            title="Preview Text"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/analyzer?docId=${doc._id}`}>
                            <button
                              className="p-1.5 rounded-lg text-slate-600 hover:text-purple-900 hover:bg-purple-50"
                              title="Open in Analyzer"
                            >
                              <FileSearch className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => openEditModal(doc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                            title="Edit Document"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleHardDelete(doc._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Hard Purge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {documents.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No documents found in vault. Upload a document to start.
                </div>
              )}
            </div>
          </Card>
        )}

        {/* =========================================================================
            VIEW MODE 2: GRID CARDS VIEW
           ========================================================================= */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc._id} className="flex flex-col justify-between hover:shadow-md transition-all p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral">{doc.category || "General"}</Badge>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {doc.retentionPolicy}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] leading-snug truncate max-w-[200px]" title={doc.title}>
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {doc.fileName} • {formatFileSize(doc.sizeBytes)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-mono">
                    {doc.textContent.slice(0, 160)}...
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatDate(doc.createdAt)}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link href={`/analyzer?docId=${doc._id}`}>
                      <button className="p-1.5 text-slate-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg" title="Analyze">
                        <FileSearch className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleHardDelete(doc._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE 3: CATEGORY-WISE GROUPED VIEW
           ========================================================================= */}
        {viewMode === "category" && (
          <div className="space-y-6">
            {Object.keys(categoryGroups).map((catName) => (
              <Card key={catName} className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#1E3A8A]" />
                    {catName} ({categoryGroups[catName].length} Documents)
                  </h3>
                  <Badge variant="info">{categoryGroups[catName].length} Records</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryGroups[catName].map((doc) => (
                    <div key={doc._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-[#0F172A] truncate">{doc.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{formatFileSize(doc.sizeBytes)} • {formatDate(doc.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setPreviewDoc(doc)} className="p-1 text-slate-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link href={`/analyzer?docId=${doc._id}`}>
                          <button className="p-1 text-slate-600 hover:text-purple-900">
                            <FileSearch className="w-4 h-4" />
                          </button>
                        </Link>
                        <button onClick={() => openEditModal(doc)} className="p-1 text-slate-600 hover:text-amber-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleHardDelete(doc._id)} className="p-1 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* PREVIEW MODAL */}
        {previewDoc && (
          <Modal
            isOpen={!!previewDoc}
            onClose={() => setPreviewDoc(null)}
            title={`Document Vault Preview: ${previewDoc.title}`}
            description={`Uploaded on ${formatDate(previewDoc.createdAt)} • Retention Policy: ${previewDoc.retentionPolicy}`}
            maxWidth="2xl"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Category:</span> <strong className="text-[#0F172A]">{previewDoc.category || "General"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Size:</span> <strong className="text-[#0F172A]">{formatFileSize(previewDoc.sizeBytes)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">File Type:</span> <strong className="text-[#0F172A]">{previewDoc.fileType.toUpperCase()}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block">Extracted Text Content</span>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap border border-slate-800">
                  {previewDoc.textContent}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="danger" size="sm" onClick={() => handleHardDelete(previewDoc._id)}>
                  <Trash2 className="w-4 h-4" /> Execute Immediate Hard Delete
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([previewDoc.textContent], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = previewDoc.fileName;
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4" /> Download Text
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* EDIT DOCUMENT MODAL */}
        {editingDoc && (
          <Modal
            isOpen={!!editingDoc}
            onClose={() => setEditingDoc(null)}
            title="Edit Document Details"
            description="Update title, category, and privacy retention rules in MongoDB."
            maxWidth="md"
          >
            <div className="space-y-4">
              <Input label="Document Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Document Category</label>
                <SearchableCategorySelect value={editCategory} onChange={setEditCategory} className="w-full" />
              </div>
              <Select
                label="Privacy Retention Policy"
                value={editRetention}
                onChange={(e) => setEditRetention(e.target.value)}
                options={[
                  { label: "Immediate Wipe", value: "immediate" },
                  { label: "24 Hours", value: "24h" },
                  { label: "7 Days", value: "7d" },
                  { label: "30 Days (Default)", value: "30d" },
                  { label: "90 Days", value: "90d" },
                  { label: "Permanent Keep", value: "keep" },
                ]}
              />

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingDoc(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} isLoading={savingEdit} className="bg-[#1E3A8A] text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardWrapper>
  );
}
