"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send, CheckCircle2, User, Building2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [subject, setSubject] = useState("Enterprise Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar />

      <section className="bg-[#0F172A] text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3 text-center">
          <Badge variant="accent" className="bg-blue-400/20 text-blue-200 border-blue-400/30 text-xs px-3 py-1">
            Enterprise Contact & Support
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Get in Touch with LawPilot AI</h1>
          <p className="text-xs sm:text-sm text-slate-300">Legal Technology Support, Custom Gateway Deployment, and Enterprise Licensing</p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Direct Enterprise Channels</h2>
              <p className="text-xs text-slate-500 mt-1">Our legal engineering team responds to all inquiries within 2 hours.</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4 bg-white border border-slate-200 flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Email Support</span>
                  <span className="text-xs text-slate-600 block">support@lawpilot.ai</span>
                  <span className="text-[10px] text-slate-400">Legal Compliance: legal@lawpilot.ai</span>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Corporate Headquarters</span>
                  <span className="text-xs text-slate-600">Enterprise Legal Tech Tower, Cyber City, Gurugram, Haryana 122002, India</span>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Enterprise Desk</span>
                  <span className="text-xs text-slate-600">+91 124 458 9000 (Mon - Fri, 9 AM - 7 PM IST)</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-md">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Send an Inquiry</h3>
                <p className="text-xs text-slate-500">Fill out the form below and an engineer will reach out immediately.</p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold">Message Received!</h4>
                  <p className="text-xs text-emerald-800">Thank you for contacting LawPilot AI. Our legal engineering team will get back to you shortly.</p>
                  <Button size="sm" onClick={() => setSubmitted(false)} className="bg-emerald-700 text-white text-xs font-bold mt-2">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<User className="w-4 h-4" />}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                  </div>

                  <Input
                    label="Organization / Law Firm"
                    placeholder="Enter your organization or company name..."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    icon={<Building2 className="w-4 h-4" />}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Message Content</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your question or enterprise requirement here..."
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 outline-none resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <Button type="submit" isLoading={loading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs gap-1.5">
                    <Send className="w-4 h-4" /> Submit Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
