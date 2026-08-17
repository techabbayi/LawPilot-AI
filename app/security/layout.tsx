import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Architecture & Zero-Day Vulnerability Disclosure Policy",
  description:
    "Explore LawPilot AI's multi-layered security model: AES-256-CBC PBKDF2 encryption, sliding window rate limits, JWT rotation, and zero-day SLA guidelines.",
  openGraph: {
    title: "Security Architecture & SLA Guidelines — LawPilot AI",
    description: "Enterprise security engineering, zero-day reporting procedures, and data protection policies.",
    url: "https://lawpilot-ai.vercel.app/security",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/security",
  },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
