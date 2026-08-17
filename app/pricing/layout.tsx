import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans — Transparent Enterprise Legal AI Subscriptions (INR ₹)",
  description:
    "Simple, transparent pricing for LawPilot AI. Free tier available with enterprise upgrades for multi-user legal teams, law firms, and compliance departments.",
  openGraph: {
    title: "LawPilot AI Pricing — Flexible Plans for Legal Teams & Law Firms",
    description: "Transparent INR (₹) subscription plans for AI legal assistant and document analysis.",
    url: "https://lawpilot-ai.vercel.app/pricing",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
