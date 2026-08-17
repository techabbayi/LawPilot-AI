import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Source Governance & Developer Contributor Guide",
  description:
    "Comprehensive developer instructions, work areas, code of conduct, and pull request guidelines for LawPilot AI under MIT & Apache 2.0 licenses.",
  openGraph: {
    title: "Open Source Governance & Contributor Guide — LawPilot AI",
    description: "Contribute to privacy-preserving legal AI technology. Self-hostable, transparent, open-source architecture.",
    url: "https://lawpilot-ai.vercel.app/oss",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/oss",
  },
};

export default function OssLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
