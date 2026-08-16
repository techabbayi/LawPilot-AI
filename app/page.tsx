"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  FileSearch,
  Split,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  IndianRupee,
  CreditCard,
  Check,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  // Dynamically load Razorpay SDK Script
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

      {/* Payment Success Modal Alert */}
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
                  Go to Platform Workspace <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setPaymentSuccess(null)} className="text-xs">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E3A8A] mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Enterprise-Grade AI Legal Gateway & Clause Audit Engine
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight max-w-4xl leading-tight">
            Enterprise Legal Intelligence. <br />
            <span className="text-[#1E3A8A]">Zero Data Compromise.</span>
          </h1>

          <p className="mt-6 text-base md:text-xl text-[#64748B] max-w-2xl font-normal leading-relaxed">
            Audit contracts in seconds, identify indemnification risks, compare side-by-side versions, and query multi-provider AI models—with total cascading hard deletion privacy.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full font-semibold bg-[#1E3A8A] hover:bg-blue-900 text-white">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-blue-200 text-[#1E3A8A] hover:bg-blue-50">
                Know More <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-[#64748B]">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-Provider AI (Groq, Gemini, OpenAI)</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> OCR PDF & DOCX Clause Extraction</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cascading Hard Wipe Privacy</span>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section id="features" className="py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="info">Enterprise Architecture</Badge>
            <h2 className="text-3xl font-bold text-[#0F172A] mt-2">Built for Legal Excellence & Total Control</h2>
            <p className="text-sm text-[#64748B] mt-2">
              Everything needed by legal counsels, founders, and compliance teams in a single cohesive workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <CardTitle>Multi-Provider AI Gateway</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                Seamlessly route queries across Groq, Gemini 1.5, OpenAI, OpenRouter, Llama 3.3, and DeepSeek with automatic zero-downtime failover.
              </CardDescription>
            </Card>

            <Card className="hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle>Cascading Hard Wipe Privacy</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                Permanently destroy uploaded documents, OCR logs, vectors, and chats across Cloudinary and MongoDB with configurable auto-retention rules.
              </CardDescription>
            </Card>

            <Card className="hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Split className="w-5 h-5" />
              </div>
              <CardTitle>Side-by-Side Contract Comparison</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                Compare two agreement versions in parallel. Instant structural diff highlights, liability winner scoring, and clause divergence reporting.
              </CardDescription>
            </Card>

            <Card className="hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <FileSearch className="w-5 h-5" />
              </div>
              <CardTitle>OCR PDF & DOCX Clause Detector</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                Audit indemnities, termination covenants, IP transfers, and governing forums with automated 0-100 risk matrix scoring.
              </CardDescription>
            </Card>

            <Card className="hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <CardTitle>Legal Contract Generator Wizard</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                Step-by-step form wizard for generating pre-audited NDAs, Employment Agreements, SaaS Terms, and Corporate Contracts.
              </CardDescription>
            </Card>

            <Card className="hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <CardTitle>RBAC & Immutable Audit Logs</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                Strict Role-Based Access Control (User, Reviewer, Admin) paired with tamper-proof security action audit trail.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* RAZORPAY INR PRICING SECTION */}
      <section id="pricing" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="info" className="gap-1 text-xs px-3 py-1">
              <IndianRupee className="w-3.5 h-3.5" /> Razorpay INR Payment Gateway Integrated
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Transparent Plans in Indian Rupees (INR)</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Instant activation via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, & EMI powered by Razorpay.
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-[#1E3A8A]" : "text-slate-400"}`}>Monthly Billing</span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 bg-slate-200 rounded-full p-1 border border-slate-300 relative transition-colors focus:outline-none"
              >
                <div
                  className={`w-4 h-4 bg-[#1E3A8A] rounded-full transition-transform ${
                    billingCycle === "yearly" ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-[#1E3A8A]" : "text-slate-400"}`}>
                Annual Billing <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <Card className="flex flex-col justify-between p-8 space-y-6 hover:shadow-md transition-all">
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

            {/* Professional Plan (Highlighted) */}
            <Card className="flex flex-col justify-between p-8 space-y-6 border-2 border-[#1E3A8A] relative shadow-xl bg-gradient-to-b from-white to-blue-50/30">
              <div className="absolute -top-3 right-6 bg-[#1E3A8A] text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full tracking-wider shadow-xs">
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
            <Card className="flex flex-col justify-between p-8 space-y-6 hover:shadow-md transition-all">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
