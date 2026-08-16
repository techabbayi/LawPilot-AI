"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  CreditCard,
  History,
  FileText,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      const data = await res.json();
      if (res.ok && data.success) {
        setMetrics(data.metrics);
        setRecentLogs(data.recentAuditLogs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <DashboardWrapper title="Super Admin Control Command">
      <div className="space-y-8 max-w-6xl mx-auto font-sans">
        {/* Header Banner */}
        <div className="bg-[#0F172A] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs px-3 py-1">
              Super Admin Privilege Level
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Enterprise Operations & Revenue Dashboard</h1>
            <p className="text-xs text-slate-400 max-w-xl">
              System-wide metrics, Razorpay INR revenue tracking, user role management, and zero-retention compliance telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOverview}
              isLoading={loading}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-3 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue (INR)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-[#0F172A]">
                ₹{metrics ? metrics.totalRevenueInRupees.toLocaleString("en-IN") : "0"}
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Real Razorpay Payment Ledger
              </span>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-[#0F172A]">{metrics ? metrics.totalUsers : 0}</h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {metrics ? metrics.adminCount : 0} Enterprise Admins
              </span>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Documents</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-[#0F172A]">{metrics ? metrics.totalDocuments : 0}</h3>
              <span className="text-[11px] text-slate-500 font-medium">100% Zero-Retention Guarded</span>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Log Events</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-[#0F172A]">{metrics ? metrics.totalAuditLogs : 0}</h3>
              <span className="text-[11px] text-slate-500 font-medium">Recorded Event Entries</span>
            </div>
          </Card>
        </div>

        {/* Quick Admin Actions & Recent Audit Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6 space-y-6 bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <History className="w-4 h-4 text-[#1E3A8A]" /> Recent Platform Audit Log Activity Stream
              </h2>
              <Link href="/admin/audit-logs" className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log._id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#0F172A] block">{log.action}</span>
                      <span className="text-slate-500 text-[11px]">{log.userEmail || "System"} • {new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <Badge variant="neutral" className="text-[10px] uppercase font-mono">{log.resourceType || "System"}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No recent audit log activities recorded.</p>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-4 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Super Admin Shortcuts
              </h2>

              <div className="space-y-2 text-xs">
                <Link href="/admin/users" className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors font-bold text-[#0F172A] flex items-center justify-between">
                  <span>Manage User Accounts & Roles</span>
                  <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
                </Link>

                <Link href="/admin/payments" className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors font-bold text-[#0F172A] flex items-center justify-between">
                  <span>Razorpay Payment Transactions</span>
                  <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
                </Link>

                <Link href="/admin/security" className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors font-bold text-[#0F172A] flex items-center justify-between">
                  <span>Security & Compliance SLA</span>
                  <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <Link href="/dashboard" className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center justify-center gap-1">
                Switch to Standard User Platform →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardWrapper>
  );
}
