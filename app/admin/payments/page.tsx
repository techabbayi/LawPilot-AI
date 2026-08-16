"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (res.ok && data.payments) {
        setPayments(data.payments);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amountInRupees || 0), 0);

  return (
    <DashboardWrapper title="Razorpay INR Payment Ledger & Revenue">
      <div className="space-y-8 max-w-6xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Razorpay Payment Transactions</h1>
            <p className="text-xs text-slate-500">Live transaction records and subscription upgrades in Indian Rupees (INR).</p>
          </div>

          <Button size="sm" onClick={fetchPayments} isLoading={loading} variant="outline" className="text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Payments
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 space-y-2 bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Revenue Collected</span>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">₹{totalRevenue.toLocaleString("en-IN")} INR</h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live Verified HMAC Orders
            </span>
          </Card>

          <Card className="p-6 space-y-2 bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Paid Transactions</span>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">{payments.length}</h3>
            <span className="text-[10px] text-slate-500 font-medium">Completed Checkout Modals</span>
          </Card>

          <Card className="p-6 space-y-2 bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Payment Gateway</span>
            <h3 className="text-lg font-bold text-[#0F172A]">Razorpay India</h3>
            <span className="text-[10px] text-blue-600 font-medium">UPI, NetBanking, Cards</span>
          </Card>
        </div>

        <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700">Transaction History ({payments.length})</span>
            <Badge variant="info">Razorpay Merchant Gateway</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Plan Tier</th>
                  <th className="p-3">Amount (INR)</th>
                  <th className="p-3">Razorpay Payment ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#0F172A]">{p.userName}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{p.userEmail}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="accent">{p.plan}</Badge>
                      </td>
                      <td className="p-3 font-bold text-emerald-700">
                        ₹{p.amountInRupees.toLocaleString("en-IN")} INR
                      </td>
                      <td className="p-3 font-mono text-slate-600 text-[11px]">
                        {p.paymentId}
                      </td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">
                        {p.orderId}
                      </td>
                      <td className="p-3 text-right text-slate-500 text-[11px]">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No Razorpay payment transactions recorded yet.
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
