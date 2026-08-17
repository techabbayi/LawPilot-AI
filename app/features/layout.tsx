import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Features — Multi-LLM Gateway, 128D RAG & PII Sanitizer",
  description:
    "Explore LawPilot AI's enterprise capabilities: Multi-LLM gateway fallback, zero-retention data sanitizer, Tesseract OCR document vault, and risk audit matrices.",
  openGraph: {
    title: "LawPilot AI Features — Enterprise Document Intelligence & AI Gateway",
    description: "Discover automated legal risk audits, PII masking, and multi-model LLM gateway routing.",
    url: "https://lawpilot-ai.vercel.app/features",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/features",
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
