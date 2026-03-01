"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  Shield,
  Lock,
  Activity,
  ArrowRight,
  Fingerprint,
  Eye,
  Server,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (!loading && user) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-white dark:text-neutral-900" />
            </div>
            <span className="text-base font-semibold tracking-tight">MedVault</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            HIS-Ready Healthcare Security
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-5">
            Secure access
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">for healthcare systems.</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Role-based access control, break-glass emergency protocols, and real-time
            security monitoring -- built for modern hospital information systems.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => router.push("/register")} className="gap-2">
              Start Securing
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Lock,
                title: "Role-Based Access",
                desc: "Granular RBAC with admin, doctor, and patient roles. Every action is scoped and verified.",
                color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
              },
              {
                icon: Fingerprint,
                title: "Break-Glass Protocol",
                desc: "Emergency access with 72-hour expiry, automatic audit trails, and admin review queues.",
                color: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
              },
              {
                icon: Eye,
                title: "SOC Dashboard",
                desc: "Real-time security operations center with threat visualization and risk scoring.",
                color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
              },
              {
                icon: Server,
                title: "HIS Integration",
                desc: "Adapter layer for hospital information systems with standardized data pipelines.",
                color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
              },
              {
                icon: Activity,
                title: "Live Audit Trail",
                desc: "Every access logged with timestamps, risk levels, and approval status tracking.",
                color: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
              },
              {
                icon: Shield,
                title: "Zero-Trust Design",
                desc: "JWT authentication, bcrypt hashing, and request-level authorization on every endpoint.",
                color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-6 transition-all duration-200 hover:shadow-lg hover:shadow-neutral-200/40 dark:hover:shadow-neutral-900/40 hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Highlight */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-8 md:p-12">
            <h2 className="text-2xl font-bold tracking-tight mb-2">System Architecture</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
              End-to-end secure pipeline from client to HIS backend
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Frontend", sub: "Next.js + shadcn/ui" },
                { label: "Auth Layer", sub: "JWT + bcrypt" },
                { label: "RBAC Engine", sub: "Role + Patient scope" },
                { label: "HIS Adapter", sub: "Mock / Live bridge" },
              ].map((item, i) => (
                <div key={item.label} className="relative">
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/40 dark:border-neutral-700/40 p-4 text-center">
                    <div className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1">
                      Layer {i + 1}
                    </div>
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ArrowRight className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            MedVault -- HIS-Ready Secure Healthcare Access
          </div>
          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            Built for healthcare security
          </div>
        </div>
      </footer>
    </div>
  );
}
