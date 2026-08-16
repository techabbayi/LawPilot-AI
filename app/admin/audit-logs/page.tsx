"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { History, RefreshCw, Search, ShieldCheck } from "lucide-react";

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.status === 403 || res.status === 401) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
      (log.resource && log.resource.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <DashboardWrapper title="Immutable System Audit Trail">
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">System Security Audit Log Stream</h1>
            <p className="text-xs text-slate-500">Immutable ledger of security logins, document actions, Razorpay payments, and account changes.</p>
          </div>

          <Button size="sm" onClick={fetchLogs} isLoading={loading} variant="outline" className="text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Log Stream
          </Button>
        </div>

        <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search audit logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Badge variant="info">Showing {filteredLogs.length} Events</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">User Identity</th>
                  <th className="p-3">Target Resource</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Audit Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            log.action.includes("DELETE")
                              ? "critical"
                              : log.action.includes("SUCCESS") || log.action.includes("PAYMENT")
                              ? "accent"
                              : "neutral"
                          }
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-700 font-sans text-[11px]">
                        {log.userEmail || "System Engine"}
                      </td>
                      <td className="p-3 text-[#0F172A] font-bold font-sans text-[11px]">
                        {log.resource}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{log.ipAddress}</td>
                      <td className="p-3 text-slate-600 font-sans max-w-xs truncate text-[11px]" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                      No audit log entries matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardWrapper>
  );
}
