"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  TrendingUp,
  Eye,
} from "lucide-react";
import { AnomalyDetection } from "@/components/features/anomaly-detection";
import { SystemHealthMonitor } from "@/components/features/system-health";
import { SessionSecurityPanel } from "@/components/features/session-security";

interface SocSummary {
  total_events: number;
  high_risk_events: number;
  pending_reviews: number;
  approved_events: number;
  high_risk_pending: number;
}

interface AuditEvent {
  user_email: string;
  patient_id: string;
  access_type: string;
  reason: string;
  timestamp: string;
  status: string;
  risk_level: string;
  alert_flag: boolean;
}

export function AdminDashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<SocSummary | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminApi.getAccessLogs(token);
      setSummary(data.soc_summary);
      setEvents(data.recent_events);
    } catch (err) {
      console.error("Failed to fetch access logs:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = summary
    ? [
        {
          label: "Total Events",
          value: summary.total_events,
          icon: Activity,
          color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
        },
        {
          label: "High Risk",
          value: summary.high_risk_events,
          icon: AlertTriangle,
          color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
        },
        {
          label: "Pending Review",
          value: summary.pending_reviews,
          icon: Clock,
          color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
        },
        {
          label: "Approved",
          value: summary.approved_events,
          icon: CheckCircle2,
          color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-neutral-100 dark:bg-neutral-800 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Operations</h1>
        <p className="text-sm text-neutral-500 mt-1">
          System-wide threat monitoring and audit overview
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="metric-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${m.color} flex items-center justify-center`}>
                  <m.icon className="w-4.5 h-4.5" />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-neutral-300" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Threat Level Indicator */}
      {summary && summary.high_risk_pending > 0 && (
        <Card className="border-red-200/60 dark:border-red-800/40 bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="absolute inset-0 rounded-full bg-red-400 pulse-ring opacity-30" />
            </div>
            <div>
              <div className="text-sm font-semibold text-red-700 dark:text-red-300">
                Elevated Threat Level
              </div>
              <div className="text-xs text-red-500 dark:text-red-400">
                {summary.high_risk_pending} pending high-risk event{summary.high_risk_pending !== 1 ? "s" : ""} --
                immediate review required
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Security Events</CardTitle>
            <Badge variant="secondary">{events.length} events</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="text-center py-12 text-sm text-neutral-400">
                  No security events recorded
                </div>
              ) : (
                events.map((evt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        evt.risk_level === "high"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {evt.risk_level === "high" ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {evt.user_email}
                        </span>
                        <Badge
                          variant={
                            evt.status === "approved"
                              ? "success"
                              : evt.status === "pending"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {evt.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Patient {evt.patient_id} -- {evt.access_type}
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-400 shrink-0">
                      {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : "-"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Innovative Features Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyDetection />
        <div className="space-y-6">
          <SystemHealthMonitor />
          <SessionSecurityPanel />
        </div>
      </div>
    </div>
  );
}
