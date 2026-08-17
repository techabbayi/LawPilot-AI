import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://lawpilot-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LawPilot AI — Enterprise Legal Intelligence & Privacy-First Multi-LLM Gateway",
    template: "%s | LawPilot AI",
  },
  description:
    "LawPilot AI is an enterprise-grade, self-hostable legal intelligence platform featuring automated PII masking, 128D vector RAG document retrieval, clause risk audits, and zero-downtime multi-LLM gateway routing.",
  keywords: [
    "AI Legal Assistant",
    "LawPilot AI",
    "Legal Document Intelligence",
    "Contract Risk Analyzer",
    "Multi-LLM Gateway",
    "Zero Retention Privacy",
    "Indian Law AI Assistant",
    "Legal Tech Platform",
    "128D Dense Vector Search",
    "Automatic PII Masking",
    "techabbayi",
  ],
  authors: [{ name: "techabbayi", url: "https://github.com/techabbayi" }],
  creator: "techabbayi",
  publisher: "LawPilot AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "LawPilot AI — Enterprise Legal Intelligence & Multi-LLM Gateway",
    description:
      "Audit legal documents in seconds with multi-provider AI gateway routing, automated PII masking, and 128D dense vector RAG search.",
    url: baseUrl,
    siteName: "LawPilot AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "LawPilot AI Enterprise Legal Intelligence Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LawPilot AI — Enterprise Legal Intelligence Platform",
    description: "AI-powered contract risk audits, multi-LLM fallback cascade, and zero-retention legal privacy.",
    creator: "@techabbayi",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Structured Data Schema for Organization & SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LawPilot AI",
    operatingSystem: "Web-based, Multi-Platform",
    applicationCategory: "BusinessApplication, LegalTechnology",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    author: {
      "@type": "Person",
      name: "techabbayi",
      url: "https://github.com/techabbayi",
    },
    url: baseUrl,
    description:
      "Enterprise legal intelligence platform featuring automated PII masking, multi-LLM gateway routing, and 128D vector RAG clause retrieval.",
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
