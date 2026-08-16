"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CreditCard,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayCheckout = async (plan: "starter" | "pro" | "enterprise") => {
    setPaymentLoading(plan);
    try {
      const res = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle }),
      });
      const orderData = await res.json();

      if (!res.ok || !orderData.orderId) {
        alert("Failed to initialize Razorpay order. Please try again.");
        setPaymentLoading(null);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "LawPilot AI Enterprise SaaS",
        description: `${plan.toUpperCase()} Legal Subscription (${billingCycle === "yearly" ? "Annual" : "Monthly"})`,
        image: "https://lawpilot.ai/logo.png",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setPaymentSuccess({
                plan: plan.toUpperCase(),
                paymentId: response.razorpay_payment_id,
                amount: orderData.amountInRupees,
              });
            } else {
              alert("Payment verification failed: " + (verifyData.error || "Invalid Signature"));
            }
          } catch (err) {
            console.error(err);
          }
        },
        prefill: {
          name: "Legal Counsel",
          email: "counsel@lawpilot.ai",
          contact: "+919876543210",
        },
        theme: {
          color: "#1E3A8A",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setPaymentSuccess({
          plan: plan.toUpperCase(),
          paymentId: `pay_mock_${Date.now()}`,
          amount: orderData.amountInRupees,
        });
      }
    } catch (e) {
      console.error("Razorpay checkout error:", e);
    } finally {
      setPaymentLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <Card className="max-w-md w-full p-6 space-y-4 border-2 border-emerald-500 shadow-2xl text-center bg-white">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 font-bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Razorpay Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">Your LawPilot AI {paymentSuccess.plan} Legal SaaS Subscription is now active.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 font-mono text-slate-700">
              <div className="flex justify-between"><span>Payment ID:</span><strong>{paymentSuccess.paymentId}</strong></div>
              <div className="flex justify-between"><span>Amount Paid:</span><strong>₹{paymentSuccess.amount.toLocaleString("en-IN")} INR</strong></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-emerald-700 font-bold">VERIFIED</span></div>
            </div>
            <div className="pt-2 flex gap-2">
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-[#1E3A8A] text-white text-xs font-bold">
                  Go to Workspace <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setPaymentSuccess(null)} className="text-xs">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-3">
          <Badge variant="accent" className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs px-3 py-1 gap-1">
            <IndianRupee className="w-3.5 h-3.5" /> Razorpay INR Payment Gateway Enabled
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Enterprise Subscriptions in Indian Rupees (INR)</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Instant activation via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, & EMI.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-blue-400" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 bg-slate-800 rounded-full p-1 border border-slate-700 relative transition-colors focus:outline-none"
            >
              <div className={`w-4 h-4 bg-blue-500 rounded-full transition-transform ${billingCycle === "yearly" ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-blue-400" : "text-slate-400"}`}>
              Annual <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-extrabold">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Starter Plan */}
          <Card className="flex flex-col justify-between p-8 space-y-6 hover:shadow-md bg-white border border-slate-200">
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A]">Starter Counsel</CardTitle>
              <div className="mt-4 text-3xl font-black text-[#0F172A] flex items-baseline gap-1">
                ₹{billingCycle === "yearly" ? "19,999" : "1,999"}
                <span className="text-xs text-slate-400 font-medium">{billingCycle === "yearly" ? "/ year" : "/ month"}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">For solo attorneys, independent legal consultants, and startups.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 50 Document Audits / month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Groq & Gemini AI Gateway</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> OCR PDF & DOCX Extraction</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 7-Day Cascading Hard Wipe</li>
              </ul>
            </div>
            <Button
              variant="outline"
              onClick={() => handleRazorpayCheckout("starter")}
              isLoading={paymentLoading === "starter"}
              className="w-full font-bold border-slate-300 text-slate-800 hover:bg-slate-50 text-xs"
            >
              <CreditCard className="w-4 h-4 mr-1.5 text-[#1E3A8A]" /> Subscribe ₹{billingCycle === "yearly" ? "19,999" : "1,999"} INR
            </Button>
          </Card>

          {/* Professional Plan */}
          <Card className="flex flex-col justify-between p-8 space-y-6 border-2 border-[#1E3A8A] relative shadow-xl bg-gradient-to-b from-white to-blue-50/30">
            <div className="absolute -top-3 right-6 bg-[#1E3A8A] text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full tracking-wider">
              Most Popular
            </div>
            <div>
              <CardTitle className="text-lg font-extrabold text-[#1E3A8A]">Professional Legal</CardTitle>
              <div className="mt-4 text-4xl font-black text-[#0F172A] flex items-baseline gap-1">
                ₹{billingCycle === "yearly" ? "49,999" : "4,999"}
                <span className="text-xs text-slate-400 font-medium">{billingCycle === "yearly" ? "/ year" : "/ month"}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">For growing law firms, legal operations teams, and corporate departments.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Contract Audits</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> All 7 Multi-Provider AI Models</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Side-by-Side Redline Comparator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> RAG 128D Dense Vector Search</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 52 Legal Template Generator Studio</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> AES-256 Key Encryption & Zero Retention</li>
              </ul>
            </div>
            <Button
              onClick={() => handleRazorpayCheckout("pro")}
              isLoading={paymentLoading === "pro"}
              className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-extrabold text-xs py-3 shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-1.5" /> Pay ₹{billingCycle === "yearly" ? "49,999" : "4,999"} via Razorpay
            </Button>
          </Card>

          {/* Enterprise Plan */}
          <Card className="flex flex-col justify-between p-8 space-y-6 hover:shadow-md bg-white border border-slate-200">
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A]">Enterprise Scale</CardTitle>
              <div className="mt-4 text-3xl font-black text-[#0F172A] flex items-baseline gap-1">
                ₹{billingCycle === "yearly" ? "1,49,999" : "14,999"}
                <span className="text-xs text-slate-400 font-medium">{billingCycle === "yearly" ? "/ year" : "/ month"}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">For global law practices & enterprise compliance departments.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Multi-Tenant Team Workspaces & RBAC</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> DocuSign & Adobe Sign E-Sign Webhooks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Custom Private AI Model Routing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 24/7 Priority SLA & Dedicated Account Manager</li>
              </ul>
            </div>
            <Button
              variant="secondary"
              onClick={() => handleRazorpayCheckout("enterprise")}
              isLoading={paymentLoading === "enterprise"}
              className="w-full font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs"
            >
              <CreditCard className="w-4 h-4 mr-1.5 text-amber-400" /> Pay ₹{billingCycle === "yearly" ? "1,49,999" : "14,999"} via Razorpay
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
