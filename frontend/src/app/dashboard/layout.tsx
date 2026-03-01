"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Shield,
  LayoutDashboard,
  Users,
  Activity,
  FileSearch,
  LogOut,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const navItems = {
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/soc", label: "SOC Center", icon: Activity },
    { href: "/dashboard/patients", label: "Patient Lookup", icon: FileSearch },
    { href: "/dashboard/access", label: "Access Reviews", icon: Users },
  ],
  doctor: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/patients", label: "My Patients", icon: Users },
    { href: "/dashboard/medical-records", label: "Medical Records", icon: FileText },
    { href: "/dashboard/emergency", label: "Emergency Access", icon: Activity },
    { href: "/dashboard/requests", label: "Access Requests", icon: FileSearch },
  ],
  patient: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/records", label: "My Records", icon: FileSearch },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
            <Shield className="w-4 h-4 text-white dark:text-neutral-900" />
          </div>
          <div className="w-24 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div className="h-full w-1/2 bg-neutral-900 dark:bg-white rounded-full shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const role = user.role as keyof typeof navItems;
  const items = navItems[role] || navItems.patient;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="glass fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                <Shield className="w-4 h-4 text-white dark:text-neutral-900" />
              </div>
              <span className="text-base font-semibold tracking-tight hidden sm:inline">
                MedVault
              </span>
            </Link>

            <Separator orientation="vertical" className="h-5 hidden sm:block" />

            <nav className="hidden md:flex items-center gap-1">
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-xs font-medium">{user.email}</span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {user.email.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-neutral-200/50 dark:border-neutral-800/50">
        <nav className="flex items-center justify-around py-2 px-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <main className="pt-20 pb-24 md:pb-8 px-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
