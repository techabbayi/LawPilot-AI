"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Download,
  AlertTriangle,
  Mail,
  Building2,
  Globe,
  Lock,
  Sparkles,
  Pencil,
  Check,
  X,
  Briefcase,
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "telemetry">("profile");

  // Profile Field Values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [role, setRole] = useState("user");
  const [joinedDate, setJoinedDate] = useState("");

  // Edit Mode per field
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [savingField, setSavingField] = useState<string | null>(null);
  const [fieldSuccessMsg, setFieldSuccessMsg] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/account/profile");
      const data = await res.json();
      if (data.user) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setDesignation(data.user.designation || "");
        setOrganization(data.user.organization || "");
        setWebsiteUrl(data.user.websiteUrl || "");
        setRole(data.user.role || "user");
        if (data.user.createdAt) {
          setJoinedDate(new Date(data.user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
        }
      }
    } catch (e) {
      console.error("Failed to load profile:", e);
    }
  };

  const handleStartEdit = (fieldName: string, currentVal: string) => {
    setEditingField(fieldName);
    setTempValue(currentVal);
    setFieldSuccessMsg("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSaveField = async (fieldName: string) => {
    setSavingField(fieldName);
    setFieldSuccessMsg("");

    const updatePayload: any = {};
    updatePayload[fieldName] = tempValue;

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        if (fieldName === "name") setName(tempValue);
        if (fieldName === "designation") setDesignation(tempValue);
        if (fieldName === "organization") setOrganization(tempValue);
        if (fieldName === "websiteUrl") setWebsiteUrl(tempValue);

        setEditingField(null);
        setFieldSuccessMsg(`Updated successfully!`);
        setTimeout(() => setFieldSuccessMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingField(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassMsg("");

    if (newPassword !== confirmPassword) {
      setPassError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPassError("New password must be at least 8 characters");
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassError(data.error || "Password change failed");
      } else {
        setPassMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPassMsg(""), 5000);
      }
    } catch (e) {
      setPassError("Network error occurred while changing password");
    } finally {
      setPassLoading(false);
    }
  };

  const handleExportAccountData = () => {
    const accountData = {
      name,
      email,
      designation,
      organization,
      websiteUrl,
      role,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(accountData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LawPilot_Account_Archive_${Date.now()}.json`;
    a.click();
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-slate-200" };
    if (pass.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 10) return { score: 2, label: "Medium", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const passStrength = getPasswordStrength(newPassword);

  return (
    <DashboardWrapper title="Profile & Account Governance">
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0F172A] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-blue-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-2xl font-black shrink-0">
              {name ? name.slice(0, 2).toUpperCase() : "LP"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">{name || "Account Profile"}</h2>
                <Badge variant="info" className="uppercase font-mono text-[10px] bg-blue-500/20 text-blue-200 border-blue-400/30">
                  {role === "admin" ? "Enterprise Admin" : "Legal Member"}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 font-medium">{email || "counsel@lawpilot.ai"}</p>
              <p className="text-[11px] text-slate-400">
                {designation ? `${designation} • ` : ""}
                {organization ? `${organization} • ` : ""}
                Joined {joinedDate || "Recent"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === "profile" ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <User className="w-4 h-4" /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === "security" ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <KeyRound className="w-4 h-4" /> Security & Password
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === "telemetry" ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Governance & Telemetry
          </button>
        </div>

        {/* Tab 1: Personal Profile (Inline Editing per Field) */}
        {activeTab === "profile" && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <User className="w-5 h-5 text-[#1E3A8A]" /> Personal Identity & Organization Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Click the pencil icon next to any field to edit and save inline.</p>
            </div>

            {fieldSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {fieldSuccessMsg}
              </div>
            )}

            <div className="space-y-5 max-w-2xl">
              {/* Field 1: Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={editingField === "name" ? tempValue : name}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={editingField !== "name"}
                      placeholder="Enter your full name..."
                      icon={<User className="w-4 h-4" />}
                      className={editingField !== "name" ? "bg-slate-50 text-slate-700" : "bg-white border-[#1E3A8A] font-semibold"}
                    />
                  </div>
                  {editingField === "name" ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSaveField("name")}
                        disabled={savingField === "name"}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                        title="Confirm & Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit("name", name)}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors border border-slate-200 shrink-0"
                      title="Edit Full Name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 2: Email Address (Primary Login - SSO Locked) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email Address (Primary Login)</label>
                <div className="relative">
                  <Input
                    value={email}
                    disabled
                    placeholder="name@company.com"
                    icon={<Mail className="w-4 h-4" />}
                    className="bg-slate-100 cursor-not-allowed opacity-80"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Primary login email address is managed via SSO identity provider.</span>
              </div>

              {/* Field 3: Legal Designation / Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Legal Designation / Title</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={editingField === "designation" ? tempValue : designation}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={editingField !== "designation"}
                      placeholder="Enter your legal designation or title..."
                      icon={<Briefcase className="w-4 h-4" />}
                      className={editingField !== "designation" ? "bg-slate-50 text-slate-700" : "bg-white border-[#1E3A8A] font-semibold"}
                    />
                  </div>
                  {editingField === "designation" ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSaveField("designation")}
                        disabled={savingField === "designation"}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                        title="Confirm & Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit("designation", designation)}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors border border-slate-200 shrink-0"
                      title="Edit Legal Designation"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 4: Organization Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Organization / Company Name</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={editingField === "organization" ? tempValue : organization}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={editingField !== "organization"}
                      placeholder="Enter your organization or company name..."
                      icon={<Building2 className="w-4 h-4" />}
                      className={editingField !== "organization" ? "bg-slate-50 text-slate-700" : "bg-white border-[#1E3A8A] font-semibold"}
                    />
                  </div>
                  {editingField === "organization" ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSaveField("organization")}
                        disabled={savingField === "organization"}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                        title="Confirm & Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit("organization", organization)}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors border border-slate-200 shrink-0"
                      title="Edit Organization Name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 5: Organization Website / URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Organization Website / URL</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={editingField === "websiteUrl" ? tempValue : websiteUrl}
                      onChange={(e) => setTempValue(e.target.value)}
                      disabled={editingField !== "websiteUrl"}
                      placeholder="https://example.com"
                      icon={<Globe className="w-4 h-4" />}
                      className={editingField !== "websiteUrl" ? "bg-slate-50 text-slate-700" : "bg-white border-[#1E3A8A] font-semibold"}
                    />
                  </div>
                  {editingField === "websiteUrl" ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSaveField("websiteUrl")}
                        disabled={savingField === "websiteUrl"}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                        title="Confirm & Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit("websiteUrl", websiteUrl)}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors border border-slate-200 shrink-0"
                      title="Edit Website URL"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 2: Security & Password Change (Kept exactly as requested) */}
        {activeTab === "security" && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#1E3A8A]" /> Authentication & Password Security
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Update your password using bcrypt salt verification.</p>
            </div>

            {passMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {passMsg}
              </div>
            )}

            {passError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)..."
                  icon={<KeyRound className="w-4 h-4" />}
                />
                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>Password Strength:</span>
                      <span>{passStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${passStrength.color} transition-all duration-300`} style={{ width: `${(passStrength.score / 3) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  icon={<KeyRound className="w-4 h-4" />}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={passLoading} className="bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold gap-1.5">
                  <KeyRound className="w-4 h-4" /> Update Password
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tab 3: Governance & Telemetry */}
        {activeTab === "telemetry" && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" /> Enterprise Governance & System Telemetry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Review system session records, account encryption state, and compliance status.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Encryption</span>
                <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> AES-256-CBC Active
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Session Protocol</span>
                <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#1E3A8A]" /> JWT HttpOnly Secured
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Type</span>
                <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Enterprise Legal SaaS
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardWrapper>
  );
}
