"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  FileSearch,
  Split,
  FolderLock,
  FileText,
  BookOpen,
  ShieldCheck,
  Cpu,
  BarChart3,
  Users,
  History,
  Scale,
  LogOut,
  User,
  CreditCard,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const cached = typeof window !== "undefined" ? sessionStorage.getItem("lawpilot_user") : null;
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {}
    }

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("lawpilot_user", JSON.stringify(data.user));
          }
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "LP";

  const displayName = user?.name || "Legal Counsel";
  const displayRole = user?.role === "admin" ? "Super Administrator" : "Platform User";
  const isAdmin = user?.role === "admin";

  // Standard User Navigation
  const userMainNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Assistant", href: "/assistant", icon: Bot },
    { label: "Doc Analyzer", href: "/analyzer", icon: FileSearch },
    { label: "Docs", href: "/docs", icon: FolderLock },
    { label: "Comparator", href: "/comparator", icon: Split },
    { label: "Doc Generator", href: "/generator", icon: FileText },
    { label: "Legal Research", href: "/research", icon: BookOpen },
  ];

  const userSecondaryNav = [
    { label: "Profile & Account", href: "/account", icon: User },
    { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
    { label: "AI Gateway", href: "/settings/ai", icon: Cpu },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  // Exclusive Super Admin Navigation (Strict 100% Platform Governance Only)
  const superAdminNav = [
    { label: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "User Roles & Access", href: "/admin/users", icon: Users },
    { label: "Audit Logs & Telemetry", href: "/admin/audit-logs", icon: History },
    { label: "Razorpay INR Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Platform System & Analytics", href: "/admin/system-status", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 z-30 shrink-0 font-sans">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-bold shadow-xs">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#F8FAFC] tracking-tight text-base leading-none">
            {isAdmin ? "LawPilot SuperAdmin" : "LawPilot AI"}
          </span>
          <span className="text-[10px] text-[#D4AF37] tracking-wider uppercase font-semibold">
            {isAdmin ? "Super Admin Command" : "Enterprise SaaS"}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {isAdmin ? (
          /* Exclusive 100% Super Admin Workspace Navigation */
          <div>
            <span className="px-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Super Admin Command
            </span>
            <nav className="space-y-1">
              {superAdminNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? "bg-[#1E3A8A] text-white shadow-xs font-bold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-amber-400" : "text-slate-400 group-hover:text-white")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : (
          /* Standard Platform Navigation */
          <>
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Main Platform</span>
              <nav className="mt-2 space-y-1">
                {userMainNav.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                        isActive
                          ? "bg-[#1E3A8A] text-white shadow-xs"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Governance & Account</span>
              <nav className="mt-2 space-y-1">
                {userSecondaryNav.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                        isActive
                          ? "bg-[#1E3A8A] text-white shadow-xs"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white font-semibold flex items-center justify-center text-xs shrink-0">
            {initials}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
            <p className="text-[10px] text-amber-400 truncate">{displayRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Sign Out & Clear Tokens"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
