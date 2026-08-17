import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LawPilot AI & Author techabbayi — Enterprise Vision & Architecture",
  description:
    "Learn about LawPilot AI's mission to revolutionize privacy-first legal AI, automated PII masking, multi-LLM routing, and creator techabbayi.",
  openGraph: {
    title: "About LawPilot AI & Author techabbayi",
    description: "Foundational vision, architecture, and creator story behind LawPilot AI.",
    url: "https://lawpilot-ai.vercel.app/about",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
