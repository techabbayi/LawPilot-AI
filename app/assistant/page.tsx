"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useRef } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { RichTextRenderer } from "@/components/ui/RichTextRenderer";
import {
  Bot,
  Send,
  Paperclip,
  ShieldCheck,
  Trash2,
  Sparkles,
  Cpu,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { IChatMessage } from "@/lib/types";

export default function AssistantPage() {
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: "m_welcome",
      role: "assistant",
      content: `Welcome to **AI Legal Companion**. I am your legal intelligence assistant powered by your configured AI Gateway.

How may I assist your legal review today? You can:
1. Attach an uploaded contract from your Vault using the attachment menu below.
2. Ask specific questions regarding indemnification, liability caps, or statutory precedents.
3. Request missing clause discovery or risk audit evaluations.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [attachedDocId, setAttachedDocId] = useState<string>("");
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGreetingLoading, setIsGreetingLoading] = useState(false);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("General");
  const [uploadRetention, setUploadRetention] = useState("30d");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Copy & Feedback states
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "liked" | "disliked">>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocs();
    fetchPersistentChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.documents) setAvailableDocs(data.documents);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPersistentChatSession = async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      if (data.sessions && data.sessions.length > 0) {
        const activeSession = data.sessions[0];
        setActiveSessionId(activeSession._id);

        if (activeSession.messages && activeSession.messages.length > 0) {
          const welcomeMsg = {
            id: "m_welcome",
            role: "assistant" as const,
            content: `Welcome back to **AI Legal Companion**. Your persistent MongoDB chat history is active below.`,
            timestamp: activeSession.createdAt || new Date().toISOString(),
          };
          setMessages([welcomeMsg, ...activeSession.messages]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkIsGreeting = (text: string) => {
    const clean = text.toLowerCase().trim();
    return ["hello", "hi", "hey", "good morning", "good evening", "good afternoon", "hii", "hiii", "thanks", "thank you", "sup", "yo"].includes(clean);
  };

  const formatTime = (ts?: string | Date) => {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "upload_new") {
      setUploadError("");
      setUploadSuccess("");
      setUploadFile(null);
      setIsUploadModalOpen(true);
    } else {
      setAttachedDocId(val);
    }
  };

  const handleExecuteUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a valid PDF or document file.");
      return;
    }

    // 200 MB max size restriction check
    if (uploadFile.size > 200 * 1024 * 1024) {
      setUploadError("File size exceeds maximum allowed limit of 200 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("category", uploadCategory);
      formData.append("retentionPolicy", uploadRetention);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to parse and save document.");
      } else {
        setUploadSuccess("Document uploaded to Vault & attached to Assistant!");
        const newDoc = data.document;
        setAvailableDocs((prev) => [newDoc, ...prev]);
        setAttachedDocId(newDoc._id);

        setTimeout(() => {
          setIsUploadModalOpen(false);
          setUploadFile(null);
          setUploadSuccess("");
        }, 1200);
      }
    } catch (e: any) {
      setUploadError(e.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const isGreeting = checkIsGreeting(textToSend);
    setIsGreetingLoading(isGreeting);

    const userMsg: IChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId || undefined,
          message: textToSend,
          attachedDocId: attachedDocId || undefined,
        }),
      });

      const data = await res.json();
      if (data.sessionId) {
        setActiveSessionId(data.sessionId);
      }
      if (data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 3000);
    }
  };

  const handleFeedback = async (msgId: string, rating: "liked" | "disliked", responseContent: string) => {
    setFeedbackMap((prev) => ({ ...prev, [msgId]: rating }));

    try {
      await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: msgId,
          query: inputMessage,
          responseSnippet: responseContent,
          rating,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Permanently wipe your chat session history from MongoDB?")) return;

    try {
      const url = activeSessionId ? `/api/chat/sessions?id=${activeSessionId}` : "/api/chat/sessions";
      await fetch(url, { method: "DELETE" });

      setMessages([
        {
          id: `welcome_${Date.now()}`,
          role: "assistant",
          content: "Chat session history permanently wiped from MongoDB. How may I assist your legal review today?",
          timestamp: new Date().toISOString(),
        },
      ]);
      setActiveSessionId(null);
      setFeedbackMap({});
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardWrapper title="AI Legal Assistant">
      <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-4 font-sans">
        {/* Top Controls Bar */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#1E3A8A]" />
              <select
                value={attachedDocId}
                onChange={handleDropdownChange}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#0F172A] focus:border-[#1E3A8A] outline-none cursor-pointer max-w-xs truncate"
              >
                <option value="">-- Attach Vault Document --</option>
                <option value="upload_new" className="font-bold text-[#1E3A8A]">
                  ➕ Upload New Document... (Max 200MB / 15 Pages)
                </option>
                {availableDocs.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="info" className="gap-1 text-[11px] py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacy Lock Active
            </Badge>

            <button
              onClick={handleClearHistory}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Wipe MongoDB Session History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-sm bg-slate-50/50 rounded-2xl border border-slate-200">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">AI Legal Companion Ready</h3>
                <p className="text-xs max-w-sm text-slate-500 mt-1">
                  Ask questions about statutory compliance, indemnification caps, contract terms, or attach a document from your Vault.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isDefaultWelcome = msg.id === "m_welcome" || msg.id.startsWith("welcome_");

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} space-y-1`}
                >
                  <div
                    className={`p-4 rounded-2xl max-w-3xl leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1E3A8A] text-white rounded-br-none shadow-xs text-xs sm:text-sm font-medium space-y-2"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs space-y-3"
                    }`}
                  >
                    {/* User Message Rendering */}
                    {msg.role === "user" ? (
                      <>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className="flex items-center justify-end gap-2 text-[10px] text-blue-200 pt-1 border-t border-blue-800/40 font-mono">
                          <span>{formatTime(msg.timestamp)}</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            title="Copy message"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* AI Assistant Message Rendering */
                      <>
                        <RichTextRenderer content={msg.content} />

                        {/* Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1">
                            <span className="font-semibold text-[#1E3A8A] block">Primary Document Citation:</span>
                            {msg.citations.map((cite, i) => (
                              <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700 italic">
                                "{cite.snippet}" — <strong className="not-italic text-[#0F172A]">{cite.sourceDocTitle}</strong>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* AI Action Sub-Bar (Excluded for Default Welcome Message) */}
                        {!isDefaultWelcome ? (
                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                            {/* Icon-Only Action Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopy(msg.id, msg.content)}
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                                title={copiedMsgId === msg.id ? "Copied!" : "Copy Response"}
                              >
                                {copiedMsgId === msg.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                )}
                              </button>

                              <button
                                onClick={() => handleFeedback(msg.id, "liked", msg.content)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  feedbackMap[msg.id] === "liked"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                    : "bg-slate-50 hover:bg-emerald-50/50 border-slate-200 text-slate-500"
                                }`}
                                title="Like (Save to Personal Preferences)"
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${feedbackMap[msg.id] === "liked" ? "text-emerald-600 fill-emerald-600" : ""}`} />
                              </button>

                              <button
                                onClick={() => handleFeedback(msg.id, "disliked", msg.content)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  feedbackMap[msg.id] === "disliked"
                                    ? "bg-red-50 text-red-700 border-red-300"
                                    : "bg-slate-50 hover:bg-red-50/50 border-slate-200 text-slate-500"
                                }`}
                                title="Dislike (Tone Adjustment)"
                              >
                                <ThumbsDown className={`w-3.5 h-3.5 ${feedbackMap[msg.id] === "disliked" ? "text-red-600 fill-red-600" : ""}`} />
                              </button>
                            </div>

                            {/* Date, Time & Model Badge */}
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>{formatTime(msg.timestamp)}</span>
                              {msg.providerUsed && (
                                <span className="flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  <Cpu className="w-3 h-3 text-blue-600" /> {msg.providerUsed}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-end text-[10px] text-slate-400 font-mono">
                            <span>{formatTime(msg.timestamp)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Animated Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-start space-y-1 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl max-w-lg bg-white border border-blue-200 shadow-md text-slate-800 rounded-bl-none flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
                    <span>{isGreetingLoading ? "AI Legal Companion is typing" : "AI Legal Companion is analyzing"}</span>
                    <span className="flex gap-1 items-center ml-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isGreetingLoading ? "Preparing response..." : "Evaluating contract terms, liability caps, and precedents..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar & Message Input Form */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Prompts:</span>
            <button
              onClick={() => handleSendMessage("Analyze the indemnification clause for unilateral liability exposure.")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 rounded-full transition-colors shrink-0 font-medium cursor-pointer"
            >
              Audit Indemnity
            </button>
            <button
              onClick={() => handleSendMessage("What are the termination notice rules and refund policies?")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 rounded-full transition-colors shrink-0 font-medium cursor-pointer"
            >
              Termination Rules
            </button>
            <button
              onClick={() => handleSendMessage("List all missing standard protective covenants in this document.")}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 rounded-full transition-colors shrink-0 font-medium cursor-pointer"
            >
              Missing Clauses
            </button>
          </div>

          {/* Input Form */}
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask AI Legal Companion about contracts, clauses, risks, or precedents..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pr-12 text-xs sm:text-sm text-[#0F172A] placeholder:text-slate-400 outline-none focus:border-[#1E3A8A] focus:bg-white transition-all resize-none h-14"
            />
            <Button
              onClick={() => handleSendMessage()}
              isLoading={loading}
              className="absolute right-2.5 top-2.5 w-9 h-9 p-0 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload New Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Contract Document to Vault"
        description="Upload PDF or document files (Max 200MB, 15 pages max). Parsed text will be stored securely in your MongoDB Docs Vault."
      >
        <div className="space-y-4 text-xs font-sans">
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-[#0F172A] block">Select File (PDF / DOCX / TXT)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const selected = e.target.files[0];
                  if (selected.size > 200 * 1024 * 1024) {
                    setUploadError("File size exceeds 200 MB maximum limit.");
                    setUploadFile(null);
                  } else {
                    setUploadError("");
                    setUploadFile(selected);
                  }
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1E3A8A] file:text-white hover:file:bg-blue-900 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Strict limit: 200 MB maximum file size & 10–15 pages max.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A] block">Contract Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] outline-none"
              >
                <option value="General">General Contract</option>
                <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                <option value="Service Agreement">Service Agreement / MSA</option>
                <option value="Employment Contract">Employment Contract</option>
                <option value="IP Agreement">IP Assignment Agreement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#0F172A] block">Privacy Retention Policy</label>
              <select
                value={uploadRetention}
                onChange={(e) => setUploadRetention(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] outline-none"
              >
                <option value="30d">30 Days Auto-Purge</option>
                <option value="7d">7 Days Purge</option>
                <option value="1d">24 Hours Purge</option>
                <option value="forever">Indefinite Retention</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleExecuteUpload}
              isLoading={uploading}
              className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold"
            >
              <Upload className="w-4 h-4 mr-1.5" /> Upload & Attach to AI Assistant
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardWrapper>
  );
}
