"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Activity,
  HardDrive,
  RefreshCw,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (data.stats) setStats(data.stats);
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper title="AI Token Usage & Platform Metrics">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header Bar */}
        <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30">
                100% REAL MONGODB ANALYTICS
              </Badge>
              <Badge variant="info" className="bg-blue-400/20 text-blue-200 border-blue-400/30">
                LIVE AUDIT TELEMETRY
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Real-Time Platform Analytics & Token Usage</h1>
            <p className="text-xs text-slate-300">
              Live aggregate metrics calculated directly from database records, AI Gateway queries, document parsing pipelines, and hard wipe audit logs.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            isLoading={loading}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Metrics
          </Button>
        </div>

        {/* Core KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Processed Pages & Docs */}
          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Processed Pages</span>
              <h3 className="text-2xl font-extrabold text-[#0F172A]">{stats?.processedPages ?? 0}</h3>
              <span className="text-[11px] text-slate-400 font-medium">{stats?.totalDocuments ?? 0} Documents Audited</span>
            </div>
          </Card>

          {/* Card 2: AI Queries Executed */}
          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">AI Queries Executed</span>
              <h3 className="text-2xl font-extrabold text-purple-700">{stats?.aiQueriesExecuted ?? 0}</h3>
              <span className="text-[11px] text-slate-400 font-medium">Assistant & Gateway Tokens</span>
            </div>
          </Card>

          {/* Card 3: Risk Flags Found */}
          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Risk Flags Found</span>
              <h3 className="text-2xl font-extrabold text-amber-600">{stats?.highRiskFlagsDetected ?? 0}</h3>
              <span className="text-[11px] text-slate-400 font-medium">Elevated Clause Covenants</span>
            </div>
          </Card>

          {/* Card 4: Hard Wipes Executed */}
          <Card className="p-5 flex items-center gap-4 bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Cascading Hard Wipes</span>
              <h3 className="text-2xl font-extrabold text-emerald-700">{stats?.privacyHardWipesExecuted ?? 0}</h3>
              <span className="text-[11px] text-slate-400 font-medium">Purges & Storage Wipes</span>
            </div>
          </Card>
        </div>

        {/* Breakdown Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* AI Provider Traffic Distribution */}
          <Card className="lg:col-span-6 p-6 space-y-5">
            <CardHeader className="p-0 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#1E3A8A]" /> Real AI Provider Traffic Distribution
                </CardTitle>
                <CardDescription>Live breakdown of AI model completions across active gateways.</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4 text-xs">
              {stats?.providerDistribution?.map((item: any) => (
                <div key={item.name} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between font-bold text-[#0F172A]">
                    <span>{item.name}</span>
                    <span className="text-blue-900 font-extrabold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#1E3A8A] to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contract Risk Distribution */}
          <Card className="lg:col-span-6 p-6 space-y-5">
            <CardHeader className="p-0 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Real Contract Risk Distribution
                </CardTitle>
                <CardDescription>Aggregated audit risk scoring across analyzed documents.</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-3 text-xs">
              {stats?.riskBreakdown?.map((item: any) => (
                <div key={item.level} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                    <span>{item.level}</span>
                  </div>
                  <Badge variant={item.level.includes("High") ? "high" : item.level.includes("Critical") ? "critical" : "low"}>
                    {item.count} Audited Documents
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Real Audit Telemetry Logs Stream */}
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" /> Real-Time Platform System Audit Stream
              </CardTitle>
              <CardDescription>Live telemetry log of security logins, uploads, AI queries, and data wipes.</CardDescription>
            </div>
            <Badge variant="neutral" className="text-xs">
              Live Database Stream
            </Badge>
          </CardHeader>

          <div className="space-y-2 text-xs">
            {stats?.recentLogs && stats.recentLogs.length > 0 ? (
              stats.recentLogs.map((log: any) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1E3A8A] uppercase">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{log.resource}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate max-w-lg">{log.details}</p>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No recent system logs recorded yet. System audit events will log here automatically.
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
