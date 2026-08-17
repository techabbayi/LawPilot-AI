import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy-First Architecture — Zero-Retention Data & PII Masking Guarantee",
  description:
    "Learn how LawPilot AI guarantees zero client data retention, automatic masking of Indian PAN/Aadhaar/CIN/GSTIN, AES-256 BYOK encryption, and air-gapped security.",
  openGraph: {
    title: "Privacy-First Architecture & Zero Data Retention Guarantee",
    description: "Enterprise privacy engineering: Automatic PII masking and cryptographic credential encryption.",
    url: "https://lawpilot-ai.vercel.app/privacy-first",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/privacy-first",
  },
};

export default function PrivacyFirstLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
