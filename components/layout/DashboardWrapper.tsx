"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export function DashboardWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Fast non-blocking background auth verification
    const cachedUser = typeof window !== "undefined" ? sessionStorage.getItem("lawpilot_user") : null;
    if (!cachedUser) {
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) {
            router.push("/login");
          } else {
            return res.json();
          }
        })
        .then((data) => {
          if (data?.user && typeof window !== "undefined") {
            sessionStorage.setItem("lawpilot_user", JSON.stringify(data.user));
          }
        })
        .catch(() => {
          router.push("/login");
        });
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader pageTitle={title} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
