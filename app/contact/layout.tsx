import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact LawPilot AI — Legal Engineering Support & Enterprise Inquiries",
  description:
    "Get in touch with LawPilot AI support, author techabbayi (srssltd@protonmail.com), or request custom enterprise deployments.",
  openGraph: {
    title: "Contact LawPilot AI & Author techabbayi",
    description: "Legal technology inquiries, enterprise self-hosting support, and developer feedback.",
    url: "https://lawpilot-ai.vercel.app/contact",
  },
  alternates: {
    canonical: "https://lawpilot-ai.vercel.app/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
