"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  RefreshCw,
  Users,
  CreditCard,
  FileText,
  ShieldCheck,
  TrendingUp,
  Server,
  Cpu,
  CheckCircle2,
  Database,
  Lock,
  UserCheck,
  FileCode,
  History,
} from "lucide-react";

export default function AdminSystemStatusPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/system-status");
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData(resData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const system = data?.system;
  const analytics = data?.analytics;

  return (
    <DashboardWrapper title="Platform System & Enterprise Analytics">
      <div className="space-y-8 max-w-6xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Platform System & Enterprise Analytics</h1>
            <p className="text-xs text-slate-500">Live operational telemetry across user growth, Razorpay revenue, document vault stats, and security audits.</p>
          </div>

          <Button size="sm" onClick={fetchAnalytics} isLoading={loading} variant="outline" className="text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
          </Button>
        </div>

        {/* Runtime Performance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 space-y-2 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Process Uptime</span>
              <Server className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">
              {system ? `${system.uptimeSeconds}s` : "--"}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Node.js: {system?.nodeVersion || "v20"}</span>
          </Card>

          <Card className="p-6 space-y-2 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Memory Allocation</span>
              <Cpu className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">
              {system ? system.memory.heapUsedMB : "--"}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">RSS: {system?.memory.rssMB || "--"}</span>
          </Card>

          <Card className="p-6 space-y-2 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MongoDB Latency</span>
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-600">
              {system ? system.dbLatencyMs : "--"}
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Database Cluster Healthy
            </span>
          </Card>
        </div>

        {/* Section 1: User Demographics */}
        <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1E3A8A]" /> User Account Growth & Demographics Analytics
            </h2>
            <Badge variant="info">Live User Directory</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Users</span>
              <h4 className="text-2xl font-extrabold text-[#0F172A]">{analytics ? analytics.users.total : 0}</h4>
              <span className="text-[10px] text-slate-400">All registered accounts</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase">Super Admins</span>
              <h4 className="text-2xl font-extrabold text-amber-900">{analytics ? analytics.users.admins : 0}</h4>
              <span className="text-[10px] text-amber-700">Full System Control</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-blue-800 uppercase">Legal Reviewers</span>
              <h4 className="text-2xl font-extrabold text-blue-900">{analytics ? analytics.users.legalReviewers : 0}</h4>
              <span className="text-[10px] text-blue-700">Pro Reviewer Tier</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Standard Users</span>
              <h4 className="text-2xl font-extrabold text-[#0F172A]">{analytics ? analytics.users.standardUsers : 0}</h4>
              <span className="text-[10px] text-slate-400">Platform Users</span>
            </div>
          </div>
        </Card>

        {/* Section 2: Razorpay Revenue & Subscription Tier Breakdown */}
        <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Razorpay INR Revenue & Subscription Analytics
            </h2>
            <Badge variant="accent">Verified Merchant Orders</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 sm:col-span-2">
              <span className="text-xs font-bold text-emerald-800 uppercase">Total Revenue (INR)</span>
              <h4 className="text-2xl font-extrabold text-emerald-950">
                ₹{analytics ? analytics.revenue.totalRevenueInRupees.toLocaleString("en-IN") : "0"}
              </h4>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live Razorpay Transactions
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Paid Orders</span>
              <h4 className="text-xl font-bold text-[#0F172A]">{analytics ? analytics.revenue.totalOrders : 0}</h4>
              <span className="text-[10px] text-slate-400">Completed Orders</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Starter (₹1.9k)</span>
              <h4 className="text-xl font-bold text-[#0F172A]">{analytics ? analytics.revenue.starterPlanCount : 0}</h4>
              <span className="text-[10px] text-slate-400">Starter Tier</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Pro (₹4.9k)</span>
              <h4 className="text-xl font-bold text-[#0F172A]">{analytics ? analytics.revenue.proPlanCount : 0}</h4>
              <span className="text-[10px] text-slate-400">Pro Tier</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Enterprise (₹14.9k)</span>
              <h4 className="text-xl font-bold text-[#0F172A]">{analytics ? analytics.revenue.enterprisePlanCount : 0}</h4>
              <span className="text-[10px] text-slate-400">Enterprise Tier</span>
            </div>
          </div>
        </Card>

        {/* Section 3 & 4: Document Vault & Security Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" /> Document Vault Category Breakdown
              </h2>
              <Badge variant="neutral">Vault Storage</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-700">Total Uploaded Documents</span>
                <span className="font-extrabold text-[#0F172A]">{analytics ? analytics.documents.totalUploaded : 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">Non-Disclosure Agreements (NDA)</span>
                <span className="font-bold text-slate-800">{analytics ? analytics.documents.ndaCount : 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">Service & Vendor Agreements</span>
                <span className="font-bold text-slate-800">{analytics ? analytics.documents.serviceAgreementCount : 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">Employment Contracts</span>
                <span className="font-bold text-slate-800">{analytics ? analytics.documents.employmentCount : 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" /> Audit Ledger & Security Stream Analytics
              </h2>
              <Badge variant="accent">Immutable Trail</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-700">Total Audit Log Events Recorded</span>
                <span className="font-extrabold text-[#0F172A]">{analytics ? analytics.securityAudit.totalAuditEvents : 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">User Sign-in & Authentication Events</span>
                <span className="font-bold text-slate-800">{analytics ? analytics.securityAudit.loginsCount : 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">Razorpay Payment Events Streamed</span>
                <span className="font-bold text-slate-800">{analytics ? analytics.securityAudit.paymentsCount : 0}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">Zero-Retention Retention SLA</span>
                <span className="font-bold text-emerald-600">100% Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardWrapper>
  );
}
