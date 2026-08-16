"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ShieldCheck, HardDriveDownload, Trash2, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  const [retentionDays, setRetentionDays] = useState("30");
  const [autoOcr, setAutoOcr] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSelfDestruct, setShowSelfDestruct] = useState(false);
  const [wiping, setWiping] = useState(false);

  const handleSaveRetention = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/privacy/retention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retentionDays: Number(retentionDays), autoOcr }),
      });
      if (res.ok) alert("Retention policy preferences updated.");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAccountSelfDestruct = async () => {
    setWiping(true);
    try {
      const res = await fetch("/api/privacy/delete-account", { method: "POST" });
      if (res.ok) {
        alert("Account and all associated records permanently wiped across Cloudinary and MongoDB.");
        window.location.href = "/login";
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWiping(false);
    }
  };

  return (
    <DashboardWrapper title="Privacy Center & Cascading Wipe Governance">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-2xl shadow-lg space-y-3 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Privacy Center & Data Ownership</h1>
              <p className="text-xs text-slate-400">Complete control over automated file retention, zero-data storage, and cascading wipes.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <CardHeader className="p-0 pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E3A8A]" /> Automated File Retention Rules
              </CardTitle>
              <CardDescription>Specify when uploaded documents are automatically purged from Cloudinary and MongoDB.</CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <Select
                label="Default Retention Duration"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                options={[
                  { label: "Immediate (Purge instantly after analysis)", value: "0" },
                  { label: "24 Hours", value: "1" },
                  { label: "7 Days", value: "7" },
                  { label: "30 Days (Default Recommended)", value: "30" },
                  { label: "90 Days", value: "90" },
                  { label: "Keep Until Manual Delete", value: "-1" },
                ]}
              />

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOcr}
                  onChange={(e) => setAutoOcr(e.target.checked)}
                  className="rounded border-slate-300 text-[#1E3A8A] w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#0F172A] block">Automatic Scanned Image OCR</span>
                  <span className="text-slate-500">Run client-side Tesseract OCR on uploaded agreement images.</span>
                </div>
              </label>

              <Button onClick={handleSaveRetention} isLoading={saving} className="w-full">
                Save Retention Preferences
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-6 flex flex-col justify-between">
            <div>
              <CardHeader className="p-0 pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <HardDriveDownload className="w-4 h-4 text-emerald-600" /> Data Ownership & Export
                </CardTitle>
                <CardDescription>Export your complete user data profile, audited documents, chats, and audit logs.</CardDescription>
              </CardHeader>

              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GDPR / CCPA Compliant Complete Structured JSON Export.</span>
                </div>

                <a href="/api/privacy/export" download className="block">
                  <Button variant="outline" className="w-full">
                    <HardDriveDownload className="w-4 h-4" /> Download Complete User Data Archive (JSON)
                  </Button>
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="text-xs">
                <span className="font-bold text-red-600 uppercase tracking-wider block">Danger Zone</span>
                <span className="text-slate-500">Permanently wipe account and all uploaded records across storage and database.</span>
              </div>

              <Button variant="danger" className="w-full" onClick={() => setShowSelfDestruct(true)}>
                <Trash2 className="w-4 h-4" /> Execute Complete Account Hard Delete
              </Button>
            </div>
          </Card>
        </div>

        {showSelfDestruct && (
          <Modal
            isOpen={showSelfDestruct}
            onClose={() => setShowSelfDestruct(false)}
            title="Confirm Permanent Account Self-Destruction"
            description="This action cannot be undone."
            maxWidth="md"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" /> Warning: Cascading Hard Wipe
                </span>
                <p>
                  All your documents in Cloudinary, MongoDB document models, clause analyses, chat histories, and audit entries will be permanently destroyed.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowSelfDestruct(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleAccountSelfDestruct} isLoading={wiping}>
                  Yes, Wipe Everything Permanently
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardWrapper>
  );
}
