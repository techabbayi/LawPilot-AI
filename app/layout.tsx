import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LawPilot AI - Enterprise Legal Intelligence & Risk Audit Platform",
  description: "AI-powered legal document analysis, clause risk detection, contract comparison, multi-provider AI gateway, and zero-retention privacy engine.",
  keywords: [
    "AI Legal Assistant",
    "Contract Risk Analyzer",
    "Clause Detection",
    "Legal Technology",
    "Multi-Provider AI Gateway",
    "Cascading Hard Delete Privacy",
    "Zero Data Retention",
  ],
  authors: [{ name: "LawPilot Legal Engineering" }],
  openGraph: {
    title: "LawPilot AI - Enterprise Legal Intelligence Platform",
    description: "Audit legal documents in seconds with multi-provider AI gateway routing and zero-retention privacy guarantees.",
    url: "https://lawpilot.ai",
    siteName: "LawPilot AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LawPilot AI - Enterprise Legal Intelligence Platform",
    description: "AI-powered contract risk audit and zero-retention legal privacy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
