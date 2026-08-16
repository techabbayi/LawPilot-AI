"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Cpu,
  Zap,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { IAISettings } from "@/lib/types";

interface ProviderHelpInfo {
  providerName: string;
  officialUrl: string;
  keyPrefix: string;
  steps: string[];
  description: string;
}

const PROVIDER_HELP_GUIDES: Record<string, ProviderHelpInfo> = {
  gemini: {
    providerName: "Google Gemini API",
    officialUrl: "https://aistudio.google.com/app/apikey",
    keyPrefix: "AIzaSy...",
    description: "Google's high-speed multimodal AI models (Gemini 1.5 Flash, 2.0 Flash, 1.5 Pro).",
    steps: [
      "Navigate to Google AI Studio at https://aistudio.google.com/app/apikey",
      "Sign in with your Google Account.",
      "Click the blue 'Create API Key' button in a new or existing project.",
      "Copy your generated secret API key (starts with AIzaSy...).",
      "Paste your key into the Google Gemini API Key field in LawPilot and click the checkmark icon to save.",
    ],
  },
  groq: {
    providerName: "Groq Llama 3.3 API",
    officialUrl: "https://console.groq.com/keys",
    keyPrefix: "gsk_...",
    description: "Ultra-fast LPU inference engine for Llama 3.3 70B Versatile.",
    steps: [
      "Open Groq Console at https://console.groq.com/keys",
      "Sign up or log in to your Groq account.",
      "Click 'Create API Key' and enter a label (e.g. 'LawPilot Enterprise').",
      "Copy your secret key (starts with gsk_...).",
      "Paste the key into the Groq API Key field and click the checkmark icon to save.",
    ],
  },
  openrouter: {
    providerName: "OpenRouter Unified Gateway",
    officialUrl: "https://openrouter.ai/keys",
    keyPrefix: "sk-or-v1-...",
    description: "Unified AI API providing access to DeepSeek-R1, Qwen 2.5, Claude, and 100+ LLMs.",
    steps: [
      "Visit OpenRouter API Keys page at https://openrouter.ai/keys",
      "Sign in with GitHub or Google.",
      "Click 'Create Key', set a credit limit if desired, and click Create.",
      "Copy your OpenRouter secret key (starts with sk-or-v1-...).",
      "Paste into the OpenRouter API Key input and click the checkmark icon to save.",
    ],
  },
  openai: {
    providerName: "OpenAI Platform API",
    officialUrl: "https://platform.openai.com/api-keys",
    keyPrefix: "sk-proj-...",
    description: "OpenAI GPT-4o and GPT-4o-mini multimodal reasoning models.",
    steps: [
      "Go to OpenAI Developer Platform at https://platform.openai.com/api-keys",
      "Log in to your OpenAI account.",
      "Click 'Create new secret key', enter a name, and generate key.",
      "Copy your secret key (starts with sk-proj-...).",
      "Paste into the OpenAI API Key field and click the checkmark icon to save.",
    ],
  },
  deepseek: {
    providerName: "DeepSeek Direct API",
    officialUrl: "https://platform.deepseek.com/api_keys",
    keyPrefix: "sk-...",
    description: "DeepSeek R1 and DeepSeek V3 open reasoning LLMs.",
    steps: [
      "Open DeepSeek Platform at https://platform.deepseek.com/api_keys",
      "Log in and navigate to the API Keys tab.",
      "Click 'Create API Key' and copy your generated key.",
      "Paste it into the DeepSeek API Key field and click the checkmark icon to save.",
    ],
  },
};

export default function AISettingsPage() {
  const [settings, setSettings] = useState<IAISettings>({
    primaryProvider: "gemini",
    fallbackProvider: "groq",
    temperature: 0.2,
    maxTokens: 4096,
    apiKeysConfigured: {
      groq: false,
      gemini: false,
      openai: false,
      openrouter: false,
      llama: true,
      deepseek: false,
      qwen: false,
      anthropic: false,
    },
    routingMode: "accuracy_optimized",
  });

  // API Key state fields (Saved Values)
  const [keysState, setKeysState] = useState<Record<string, string>>({
    geminiKey: "",
    groqKey: "",
    openaiKey: "",
    openrouterKey: "",
    deepseekKey: "",
  });

  // Temporary Draft Editing Values
  const [draftKeys, setDraftKeys] = useState<Record<string, string>>({});

  // Editing toggle state for each provider
  const [isEditingKey, setIsEditingKey] = useState<Record<string, boolean>>({});

  // Show/Hide password toggle state
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Saving loading states
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedSuccessKey, setSavedSuccessKey] = useState<string | null>(null);
  const [savingRouting, setSavingRouting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Dynamic Models Options
  const [modelOptions, setModelOptions] = useState<any[]>([]);

  // Help Modal state
  const [helpModalProvider, setHelpModalProvider] = useState<string | null>(null);

  useEffect(() => {
    fetchAISettings();
    fetchActiveModels();
  }, []);

  const fetchAISettings = async () => {
    try {
      const res = await fetch("/api/ai-settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.maskedKeys) {
        setKeysState({
          geminiKey: data.maskedKeys.geminiKey || "",
          groqKey: data.maskedKeys.groqKey || "",
          openaiKey: data.maskedKeys.openaiKey || "",
          openrouterKey: data.maskedKeys.openrouterKey || "",
          deepseekKey: data.maskedKeys.deepseekKey || "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActiveModels = async () => {
    try {
      const res = await fetch("/api/ai-settings/models");
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        setModelOptions(data.models);
      }
    } catch (e) {
      console.error("Models fetch notice:", e);
    }
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  // Start Pencil Edit for a Provider
  const handleStartEdit = (provider: string, currentVal: string) => {
    setDraftKeys((prev) => ({ ...prev, [provider]: currentVal.includes("••••") ? "" : currentVal }));
    setIsEditingKey((prev) => ({ ...prev, [provider]: true }));
  };

  // Cancel Edit for a Provider
  const handleCancelEdit = (provider: string) => {
    setIsEditingKey((prev) => ({ ...prev, [provider]: false }));
  };

  // Confirm Save for a specific provider key
  const handleConfirmSaveKey = async (providerKeyName: string, providerKey: string) => {
    const valToSave = draftKeys[providerKey] ?? "";
    setSavingKey(providerKey);
    setSavedSuccessKey(null);

    try {
      const payload: Record<string, any> = {
        primaryProvider: settings.primaryProvider,
        fallbackProvider: settings.fallbackProvider,
        routingMode: settings.routingMode,
        [providerKeyName]: valToSave,
      };

      const res = await fetch("/api/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSavedSuccessKey(providerKey);
        setIsEditingKey((prev) => ({ ...prev, [providerKey]: false }));
        if (data.settings) setSettings(data.settings);
        fetchAISettings();
        fetchActiveModels();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ai_keys_updated"));
        }
        setTimeout(() => setSavedSuccessKey(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingKey(null);
    }
  };

  // Save Routing Preferences
  const handleSaveRouting = async () => {
    setSavingRouting(true);
    setSuccessMsg("");
    try {
      const payload = {
        primaryProvider: settings.primaryProvider,
        fallbackProvider: settings.fallbackProvider,
        routingMode: settings.routingMode,
      };

      const res = await fetch("/api/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Primary Gateway routing rules updated successfully!");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ai_keys_updated"));
        }
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingRouting(false);
    }
  };

  const activeHelpInfo = helpModalProvider ? PROVIDER_HELP_GUIDES[helpModalProvider] : null;

  // Determine active configured keys
  const configured = settings.apiKeysConfigured || {};
  const activeKeysCount = Object.values(configured).filter(Boolean).length;

  // Build Primary Provider options dynamically based on active saved keys
  let dynamicPrimaryOptions: { label: string; value: string }[] = [];

  if (configured.gemini) {
    dynamicPrimaryOptions.push(
      { label: "Gemini 3 Flash Preview (Google - Frontier Intelligence)", value: "gemini-3-flash-preview" },
      { label: "Gemini 1.5 Flash (Google - High Speed)", value: "gemini" },
      { label: "Gemini 1.5 Pro (Google Multimodal)", value: "gemini-1.5-pro" },
      { label: "Gemini 2.0 Flash (Google Next-Gen)", value: "gemini-2.0-flash" }
    );
  }
  if (configured.groq) {
    dynamicPrimaryOptions.push({ label: "Groq Gateway (Llama 3.3 70B)", value: "groq" });
  }
  if (configured.openrouter) {
    dynamicPrimaryOptions.push({ label: "OpenRouter Unified API", value: "openrouter" });
  }
  if (configured.openai) {
    dynamicPrimaryOptions.push({ label: "OpenAI (GPT-4o)", value: "openai" });
  }
  if (configured.deepseek) {
    dynamicPrimaryOptions.push({ label: "DeepSeek Direct (DeepSeek R1)", value: "deepseek" });
  }

  // Fallback if no keys added yet
  if (dynamicPrimaryOptions.length === 0) {
    dynamicPrimaryOptions = [
      { label: "Gemini 1.5 Flash (Google - Recommended)", value: "gemini" },
      { label: "Groq Gateway (Llama 3.3 70B)", value: "groq" },
      { label: "OpenRouter Unified API", value: "openrouter" },
      { label: "OpenAI (GPT-4o)", value: "openai" },
      { label: "DeepSeek (DeepSeek R1)", value: "deepseek" },
    ];
  }

  // Fallback Provider logic: Disabled if ONLY 1 key is active
  const isFallbackDisabled = activeKeysCount <= 1;

  let dynamicFallbackOptions: { label: string; value: string }[] = [];
  if (isFallbackDisabled) {
    dynamicFallbackOptions = [
      { label: "Disabled (Add a 2nd API key like Groq to enable failover)", value: "disabled" },
    ];
  } else {
    if (configured.groq && settings.primaryProvider !== "groq") {
      dynamicFallbackOptions.push({ label: "Groq (Llama 3.3 70B Versatile)", value: "groq" });
    }
    if (configured.gemini && settings.primaryProvider !== "gemini") {
      dynamicFallbackOptions.push({ label: "Google Gemini (Gemini 1.5 Flash)", value: "gemini" });
    }
    if (configured.openrouter && settings.primaryProvider !== "openrouter") {
      dynamicFallbackOptions.push({ label: "OpenRouter Unified Gateway", value: "openrouter" });
    }
    if (configured.openai && settings.primaryProvider !== "openai") {
      dynamicFallbackOptions.push({ label: "OpenAI (GPT-4o)", value: "openai" });
    }
    if (configured.deepseek && settings.primaryProvider !== "deepseek") {
      dynamicFallbackOptions.push({ label: "DeepSeek (DeepSeek R1)", value: "deepseek" });
    }
    if (dynamicFallbackOptions.length === 0) {
      dynamicFallbackOptions = [
        { label: "Groq (Llama 3.3 70B Versatile)", value: "groq" },
        { label: "Google Gemini (Gemini 1.5 Flash)", value: "gemini" },
      ];
    }
  }

  return (
    <DashboardWrapper title="AI Gateway Routing & Encrypted Credentials">
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-2xl shadow-lg space-y-4 border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30">
                  AES-256 ENCRYPTED DB STORAGE
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">AI Gateway & Encrypted Provider Credentials</h1>
              <p className="text-xs text-slate-300 max-w-2xl">
                Click the Pencil icon next to any provider field to enter your API key, then click the checkmark icon to encrypt and save in MongoDB.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 shrink-0">
              <Lock className="w-6 h-6 text-emerald-400" />
              <div className="text-xs">
                <span className="font-bold text-white block">Encrypted at Rest</span>
                <span className="text-slate-300">Cryptographic Salt Derived</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: MODEL ROUTING PREFERENCES */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-6">
              <CardHeader className="p-0 pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#1E3A8A]" /> Primary Gateway Routing Rules
                </CardTitle>
              </CardHeader>

              <div className="space-y-5">
                <Select
                  label="Primary AI Gateway Provider"
                  value={settings.primaryProvider}
                  onChange={(e) => setSettings({ ...settings, primaryProvider: e.target.value as any })}
                  options={dynamicPrimaryOptions}
                />

                <Select
                  label={isFallbackDisabled ? "Fallback AI Provider (Disabled - Requires 2+ Keys)" : "Fallback AI Provider (Zero Downtime)"}
                  value={isFallbackDisabled ? "disabled" : settings.fallbackProvider}
                  disabled={isFallbackDisabled}
                  onChange={(e) => setSettings({ ...settings, fallbackProvider: e.target.value as any })}
                  options={dynamicFallbackOptions}
                />

                <Select
                  label="Gateway Optimization Mode"
                  value={settings.routingMode}
                  onChange={(e) => setSettings({ ...settings, routingMode: e.target.value as any })}
                  options={[
                    { label: "Accuracy & Precision (Legal Standard)", value: "accuracy_optimized" },
                    { label: "Ultra Low Latency & High Speed", value: "speed_optimized" },
                    { label: "Cost & Token Efficiency", value: "cost_optimized" },
                  ]}
                />

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-[#0F172A] block">Active Primary Provider:</span>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Configured Engine:</span>
                    <strong className="text-blue-900 uppercase font-extrabold">{settings.primaryProvider}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Failover Engine:</span>
                    <strong className="text-purple-900 uppercase font-extrabold">{settings.fallbackProvider}</strong>
                  </div>
                </div>

                <Button onClick={handleSaveRouting} isLoading={savingRouting} className="w-full bg-[#1E3A8A] hover:bg-blue-900 font-semibold py-2.5">
                  Save Routing Preferences
                </Button>
              </div>
            </Card>

            {/* Provider Status Summary Card */}
            <Card className="p-6 space-y-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Multi-Provider Status Matrix
                </CardTitle>
              </CardHeader>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: "Google Gemini API", key: "gemini", configured: settings.apiKeysConfigured?.gemini },
                  { name: "Groq (Llama 3.3 70B)", key: "groq", configured: settings.apiKeysConfigured?.groq },
                  { name: "OpenRouter Unified API", key: "openrouter", configured: settings.apiKeysConfigured?.openrouter },
                  { name: "OpenAI GPT-4o", key: "openai", configured: settings.apiKeysConfigured?.openai },
                  { name: "DeepSeek R1", key: "deepseek", configured: settings.apiKeysConfigured?.deepseek },
                ].map((item) => (
                  <div key={item.key} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-[#0F172A]">{item.name}</span>
                    <Badge variant={item.configured ? "low" : "neutral"}>
                      {item.configured ? "Encrypted & Active" : "Unconfigured"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: PROVIDER CREDENTIALS WITH INLINE PENCIL & CHECK/CANCEL ICONS */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 space-y-6">
              <CardHeader className="p-0 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" /> Attached Provider Credentials
                  </CardTitle>
                  <span className="text-xs text-slate-500 font-medium">Click Pencil icon to edit any key</span>
                </div>
              </CardHeader>

              <div className="space-y-6">
                {/* 1. GOOGLE GEMINI KEY */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Google Gemini API Key
                    </label>
                    <Badge variant={settings.apiKeysConfigured?.gemini ? "low" : "neutral"} className="text-[10px]">
                      {settings.apiKeysConfigured?.gemini ? "Encrypted & Active" : "Missing Key"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKeys["gemini"] ? "text" : "password"}
                        value={isEditingKey["gemini"] ? (draftKeys["gemini"] ?? "") : keysState.geminiKey}
                        onChange={(e) => setDraftKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                        disabled={!isEditingKey["gemini"]}
                        placeholder={isEditingKey["gemini"] ? "Paste AIzaSy... key here" : "AIzaSy..."}
                        className={`w-full border rounded-lg py-2 pl-3 pr-10 text-xs font-mono transition-all ${
                          isEditingKey["gemini"]
                            ? "bg-white border-[#1E3A8A] ring-2 ring-blue-100 text-[#0F172A]"
                            : "bg-slate-100/70 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey("gemini")}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showKeys["gemini"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {!isEditingKey["gemini"] ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit("gemini", keysState.geminiKey)}
                        className="p-2 bg-white hover:bg-blue-50 text-blue-900 border border-slate-300 rounded-lg shadow-xs transition-colors shrink-0"
                        title="Edit Gemini API Key"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmSaveKey("geminiKey", "gemini")}
                          disabled={savingKey === "gemini"}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                          title="Confirm & Save Key"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit("gemini")}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                          title="Cancel Editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {savedSuccessKey === "gemini" && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Gemini API Key encrypted & saved!
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setHelpModalProvider("gemini")}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline pt-0.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> How to get a Google Gemini API Key? (Step-by-Step Guide)
                  </button>
                </div>

                {/* 2. GROQ KEY */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Groq API Key (Llama 3.3 70B)
                    </label>
                    <Badge variant={settings.apiKeysConfigured?.groq ? "low" : "neutral"} className="text-[10px]">
                      {settings.apiKeysConfigured?.groq ? "Encrypted & Active" : "Missing Key"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKeys["groq"] ? "text" : "password"}
                        value={isEditingKey["groq"] ? (draftKeys["groq"] ?? "") : keysState.groqKey}
                        onChange={(e) => setDraftKeys((prev) => ({ ...prev, groq: e.target.value }))}
                        disabled={!isEditingKey["groq"]}
                        placeholder={isEditingKey["groq"] ? "Paste gsk_... key here" : "gsk_..."}
                        className={`w-full border rounded-lg py-2 pl-3 pr-10 text-xs font-mono transition-all ${
                          isEditingKey["groq"]
                            ? "bg-white border-amber-600 ring-2 ring-amber-100 text-[#0F172A]"
                            : "bg-slate-100/70 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey("groq")}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showKeys["groq"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {!isEditingKey["groq"] ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit("groq", keysState.groqKey)}
                        className="p-2 bg-white hover:bg-amber-50 text-amber-900 border border-slate-300 rounded-lg shadow-xs transition-colors shrink-0"
                        title="Edit Groq API Key"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmSaveKey("groqKey", "groq")}
                          disabled={savingKey === "groq"}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                          title="Confirm & Save Key"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit("groq")}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                          title="Cancel Editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {savedSuccessKey === "groq" && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Groq API Key encrypted & saved!
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setHelpModalProvider("groq")}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 hover:underline pt-0.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> How to get a Groq API Key? (Step-by-Step Guide)
                  </button>
                </div>

                {/* 3. OPENROUTER KEY */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-600" /> OpenRouter Unified API Key
                    </label>
                    <Badge variant={settings.apiKeysConfigured?.openrouter ? "low" : "neutral"} className="text-[10px]">
                      {settings.apiKeysConfigured?.openrouter ? "Encrypted & Active" : "Missing Key"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKeys["openrouter"] ? "text" : "password"}
                        value={isEditingKey["openrouter"] ? (draftKeys["openrouter"] ?? "") : keysState.openrouterKey}
                        onChange={(e) => setDraftKeys((prev) => ({ ...prev, openrouter: e.target.value }))}
                        disabled={!isEditingKey["openrouter"]}
                        placeholder={isEditingKey["openrouter"] ? "Paste sk-or-v1-... key here" : "sk-or-v1-..."}
                        className={`w-full border rounded-lg py-2 pl-3 pr-10 text-xs font-mono transition-all ${
                          isEditingKey["openrouter"]
                            ? "bg-white border-purple-600 ring-2 ring-purple-100 text-[#0F172A]"
                            : "bg-slate-100/70 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey("openrouter")}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showKeys["openrouter"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {!isEditingKey["openrouter"] ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit("openrouter", keysState.openrouterKey)}
                        className="p-2 bg-white hover:bg-purple-50 text-purple-900 border border-slate-300 rounded-lg shadow-xs transition-colors shrink-0"
                        title="Edit OpenRouter Key"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmSaveKey("openrouterKey", "openrouter")}
                          disabled={savingKey === "openrouter"}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                          title="Confirm & Save Key"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit("openrouter")}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                          title="Cancel Editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {savedSuccessKey === "openrouter" && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OpenRouter API Key encrypted & saved!
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setHelpModalProvider("openrouter")}
                    className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 hover:underline pt-0.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> How to get an OpenRouter Key? (Step-by-Step Guide)
                  </button>
                </div>

                {/* 4. OPENAI KEY */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-600" /> OpenAI API Key
                    </label>
                    <Badge variant={settings.apiKeysConfigured?.openai ? "low" : "neutral"} className="text-[10px]">
                      {settings.apiKeysConfigured?.openai ? "Encrypted & Active" : "Missing Key"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKeys["openai"] ? "text" : "password"}
                        value={isEditingKey["openai"] ? (draftKeys["openai"] ?? "") : keysState.openaiKey}
                        onChange={(e) => setDraftKeys((prev) => ({ ...prev, openai: e.target.value }))}
                        disabled={!isEditingKey["openai"]}
                        placeholder={isEditingKey["openai"] ? "Paste sk-proj-... key here" : "sk-proj-..."}
                        className={`w-full border rounded-lg py-2 pl-3 pr-10 text-xs font-mono transition-all ${
                          isEditingKey["openai"]
                            ? "bg-white border-emerald-600 ring-2 ring-emerald-100 text-[#0F172A]"
                            : "bg-slate-100/70 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey("openai")}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showKeys["openai"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {!isEditingKey["openai"] ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit("openai", keysState.openaiKey)}
                        className="p-2 bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-300 rounded-lg shadow-xs transition-colors shrink-0"
                        title="Edit OpenAI Key"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmSaveKey("openaiKey", "openai")}
                          disabled={savingKey === "openai"}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                          title="Confirm & Save Key"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit("openai")}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                          title="Cancel Editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {savedSuccessKey === "openai" && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OpenAI API Key encrypted & saved!
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setHelpModalProvider("openai")}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline pt-0.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> How to get an OpenAI Key? (Step-by-Step Guide)
                  </button>
                </div>

                {/* 5. DEEPSEEK KEY */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-500" /> DeepSeek Direct API Key
                    </label>
                    <Badge variant={settings.apiKeysConfigured?.deepseek ? "low" : "neutral"} className="text-[10px]">
                      {settings.apiKeysConfigured?.deepseek ? "Encrypted & Active" : "Missing Key"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKeys["deepseek"] ? "text" : "password"}
                        value={isEditingKey["deepseek"] ? (draftKeys["deepseek"] ?? "") : keysState.deepseekKey}
                        onChange={(e) => setDraftKeys((prev) => ({ ...prev, deepseek: e.target.value }))}
                        disabled={!isEditingKey["deepseek"]}
                        placeholder={isEditingKey["deepseek"] ? "Paste sk-... key here" : "sk-..."}
                        className={`w-full border rounded-lg py-2 pl-3 pr-10 text-xs font-mono transition-all ${
                          isEditingKey["deepseek"]
                            ? "bg-white border-blue-600 ring-2 ring-blue-100 text-[#0F172A]"
                            : "bg-slate-100/70 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey("deepseek")}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showKeys["deepseek"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {!isEditingKey["deepseek"] ? (
                      <button
                        type="button"
                        onClick={() => handleStartEdit("deepseek", keysState.deepseekKey)}
                        className="p-2 bg-white hover:bg-blue-50 text-blue-900 border border-slate-300 rounded-lg shadow-xs transition-colors shrink-0"
                        title="Edit DeepSeek Key"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmSaveKey("deepseekKey", "deepseek")}
                          disabled={savingKey === "deepseek"}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                          title="Confirm & Save Key"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit("deepseek")}
                          className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                          title="Cancel Editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {savedSuccessKey === "deepseek" && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DeepSeek API Key encrypted & saved!
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setHelpModalProvider("deepseek")}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline pt-0.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> How to get a DeepSeek Key? (Step-by-Step Guide)
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* STEP-BY-STEP HELP MODAL POPUP */}
        {activeHelpInfo && (
          <Modal
            isOpen={!!activeHelpInfo}
            onClose={() => setHelpModalProvider(null)}
            title={`Step-by-Step Guide: How to Get ${activeHelpInfo.providerName} Key`}
            description={activeHelpInfo.description}
            maxWidth="md"
          >
            <div className="space-y-5">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#1E3A8A]">Official Provider Console:</span>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-slate-700 truncate max-w-[240px]">{activeHelpInfo.officialUrl}</span>
                  <a
                    href={activeHelpInfo.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs"
                  >
                    Open Provider Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <span className="font-bold text-[#0F172A] uppercase tracking-wider block">Step-by-Step Instructions:</span>
                <div className="space-y-2.5">
                  {activeHelpInfo.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                      <div className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => setHelpModalProvider(null)}>
                  Got It, Thanks!
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardWrapper>
  );
}
