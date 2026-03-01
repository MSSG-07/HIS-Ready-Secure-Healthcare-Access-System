"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Shield,
  Clock,
  Heart,
  Activity,
  Lock,
} from "lucide-react";

export function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Health Portal</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Your secure health information dashboard
        </p>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/40 dark:border-blue-800/40">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-neutral-900/80 shadow-sm flex items-center justify-center">
              <Heart className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Welcome back</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {user?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="metric-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <CardTitle className="text-sm">Access Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="success">Protected</Badge>
              <span className="text-xs text-neutral-400">RBAC Active</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Your records are protected by role-based access control. Only authorized personnel
              can view your health data.
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <CardTitle className="text-sm">Audit Trail</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Active</Badge>
              <span className="text-xs text-neutral-400">Real-time logging</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Every access to your records is logged and monitored. Emergency accesses are
              flagged for review.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Security Features</CardTitle>
          <CardDescription>How MedVault protects your health data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                icon: Lock,
                title: "End-to-End Encryption",
                desc: "All data is encrypted in transit and at rest using industry-standard protocols",
              },
              {
                icon: Shield,
                title: "Role-Based Access Control",
                desc: "Only assigned doctors and authorized staff can view your records",
              },
              {
                icon: Clock,
                title: "Emergency Access Monitoring",
                desc: "Break-glass access is limited to 72 hours and immediately flagged to administrators",
              },
              {
                icon: FileText,
                title: "Complete Audit Log",
                desc: "Every interaction with your data creates a permanent, tamper-proof log entry",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
