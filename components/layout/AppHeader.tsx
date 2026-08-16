"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Cpu, ShieldCheck, CheckCircle2, CheckCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const AppHeader = ({ pageTitle }: { pageTitle: string }) => {
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProviderName, setActiveProviderName] = useState("");
  const [isGatewayConfigured, setIsGatewayConfigured] = useState(false);
  const [realNotifications, setRealNotifications] = useState<any[]>([]);
  const [isUnread, setIsUnread] = useState(false);

  useEffect(() => {
    fetchAISettings();
    fetchRealNotifications();

    const handleUpdate = () => fetchAISettings();
    window.addEventListener("ai_keys_updated", handleUpdate);
    return () => window.removeEventListener("ai_keys_updated", handleUpdate);
  }, []);

  const fetchAISettings = async () => {
    try {
      const res = await fetch("/api/ai-settings");
      const data = await res.json();
      if (data.settings) {
        const primaryProv = data.settings.primaryProvider || "gemini-3-flash-preview";

        const provNameMap: Record<string, string> = {
          "gemini-3-flash-preview": "Gemini 3 Flash Preview",
          gemini: "Gemini 3 Flash Preview",
          "gemini-1.5-flash": "Gemini 1.5 Flash",
          "gemini-2.0-flash": "Gemini 2.0 Flash",
          "gemini-1.5-pro": "Gemini 1.5 Pro",
          groq: "Groq Llama 3.3 70B",
          openai: "OpenAI GPT-4o",
          openrouter: "OpenRouter Unified",
          deepseek: "DeepSeek R1",
          qwen: "Qwen 2.5 Legal",
          anthropic: "Anthropic Claude",
        };

        const displayName = provNameMap[primaryProv] || primaryProv;
        setActiveProviderName(displayName);

        const configured = data.settings.apiKeysConfigured || {};
        const masked = data.maskedKeys || {};

        // Dynamic Check: Verify if API Key is configured for the SELECTED primary provider
        let isPrimaryConfigured = false;
        if (primaryProv.startsWith("gemini")) {
          isPrimaryConfigured = !!(configured.gemini || (masked.geminiKey && masked.geminiKey.trim()));
        } else if (primaryProv.startsWith("groq")) {
          isPrimaryConfigured = !!(configured.groq || (masked.groqKey && masked.groqKey.trim()));
        } else if (primaryProv.startsWith("openai")) {
          isPrimaryConfigured = !!(configured.openai || (masked.openaiKey && masked.openaiKey.trim()));
        } else if (primaryProv.startsWith("openrouter")) {
          isPrimaryConfigured = !!(configured.openrouter || (masked.openrouterKey && masked.openrouterKey.trim()));
        } else if (primaryProv.startsWith("deepseek")) {
          isPrimaryConfigured = !!(configured.deepseek || (masked.deepseekKey && masked.deepseekKey.trim()));
        } else if (primaryProv.startsWith("anthropic")) {
          isPrimaryConfigured = !!(configured.anthropic || (masked.anthropicKey && masked.anthropicKey.trim()));
        }

        setIsGatewayConfigured(isPrimaryConfigured);
      } else {
        setIsGatewayConfigured(false);
      }
    } catch (e) {
      console.error(e);
      setIsGatewayConfigured(false);
    }
  };

  const fetchRealNotifications = async () => {
    try {
      const clearedAtStr = typeof window !== "undefined" ? localStorage.getItem("lawpilot_notifs_cleared_at") : null;
      const clearedAtTime = clearedAtStr ? parseInt(clearedAtStr, 10) : 0;
      const isReadFlag = typeof window !== "undefined" ? localStorage.getItem("lawpilot_notifs_read") === "true" : false;

      const res = await fetch("/api/documents");
      const data = await res.json();

      if (data.documents && data.documents.length > 0) {
        const unclearedDocs = data.documents.filter((doc: any) => {
          const docCreatedAt = new Date(doc.createdAt).getTime();
          return docCreatedAt > clearedAtTime;
        });

        if (unclearedDocs.length === 0) {
          setRealNotifications([]);
          setIsUnread(false);
        } else {
          const items = unclearedDocs.slice(0, 4).map((doc: any) => ({
            id: doc._id,
            title: `Document Uploaded: ${doc.title}`,
            desc: `${doc.fileName} (${doc.category || "General"}) • Retention: ${doc.retentionPolicy || "30d"}`,
            time: formatDate(doc.createdAt),
            type: "doc",
          }));
          setRealNotifications(items);
          setIsUnread(!isReadFlag);
        }
      } else {
        setRealNotifications([]);
        setIsUnread(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAsRead = () => {
    setIsUnread(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("lawpilot_notifs_read", "true");
    }
  };

  const handleClearAll = () => {
    setRealNotifications([]);
    setIsUnread(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("lawpilot_notifs_cleared_at", Date.now().toString());
      localStorage.setItem("lawpilot_notifs_read", "true");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/docs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">{pageTitle}</h2>
      </div>

      {/* Real Interactive Search Form */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-72 text-slate-400 focus-within:border-[#1E3A8A] transition-colors">
        <Search className="w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contracts in Docs Vault..."
          className="bg-transparent text-xs text-[#0F172A] placeholder:text-slate-400 outline-none w-full"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Dynamic Active AI Gateway Indicator */}
        <Link
          href="/settings/ai"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
            isGatewayConfigured
              ? "bg-blue-50/80 border-blue-200 text-[#1E3A8A] hover:bg-blue-100/80 font-bold"
              : "bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100/80"
          }`}
        >
          <Cpu className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {isGatewayConfigured && activeProviderName ? (
              <>Active AI: <strong className="font-semibold text-blue-900">{activeProviderName}</strong></>
            ) : (
              <>AI Gateway: <strong className="font-semibold">Inactive (Add Key)</strong></>
            )}
          </span>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isGatewayConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          ></span>
        </Link>

        {/* Zero Retention Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy Retention: 30 Days
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {isUnread && realNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-88 bg-white rounded-xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Workspace Activity</span>
                  <span className="text-[10px] text-slate-400">Real-Time Audit Stream</span>
                </div>

                <div className="flex items-center gap-2">
                  {realNotifications.length > 0 && (
                    <>
                      <button
                        onClick={handleMarkAsRead}
                        className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark Read
                      </button>

                      <button
                        onClick={handleClearAll}
                        className="text-[11px] text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 hover:underline ml-1 cursor-pointer"
                        title="Clear all notifications"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear All
                      </button>
                    </>
                  )}
                  <Badge variant={isUnread && realNotifications.length > 0 ? "info" : "neutral"}>
                    {isUnread && realNotifications.length > 0 ? `${realNotifications.length} New` : "Read"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {realNotifications.length > 0 ? (
                  realNotifications.map((notif) => (
                    <Link key={notif.id} href="/docs" onClick={() => setShowNotifs(false)}>
                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 space-y-1 hover:bg-blue-100/70 transition-colors">
                        <div className="flex items-center justify-between text-[#1E3A8A] font-bold">
                          <span className="truncate max-w-[180px]">{notif.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] truncate">{notif.desc}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-5 text-center text-slate-400 text-xs space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    <span className="font-medium text-[#0F172A] block">All systems nominal</span>
                    <span className="text-[11px] text-slate-500">Workspace notifications read and cleared.</span>
                  </div>
                )}
              </div>

              {realNotifications.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <Link href="/docs" onClick={() => setShowNotifs(false)} className="text-blue-900 font-bold hover:underline">
                    View Docs Vault →
                  </Link>
                  <button onClick={handleClearAll} className="text-slate-400 hover:text-red-600 font-medium cursor-pointer">
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
