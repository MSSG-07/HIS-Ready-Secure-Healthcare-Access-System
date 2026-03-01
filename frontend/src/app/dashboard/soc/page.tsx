"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Eye,
  TrendingUp,
  Lock,
  Wifi,
} from "lucide-react";

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

export default function SOCPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<SocSummary | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filteredEvents =
    filter === "all"
      ? events
      : filter === "high"
      ? events.filter((e) => e.risk_level === "high")
      : events.filter((e) => e.status === filter);

  const threatScore = summary
    ? Math.min(
        100,
        Math.round(
          ((summary.high_risk_pending * 4 + summary.pending_reviews) /
            Math.max(summary.total_events, 1)) *
            100
        )
      )
    : 0;

  const threatLevel =
    threatScore > 60 ? "Critical" : threatScore > 30 ? "Elevated" : "Normal";
  const threatColor =
    threatScore > 60
      ? "text-red-600 dark:text-red-400"
      : threatScore > 30
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg shimmer" />
        <div className="h-[200px] bg-neutral-100 dark:bg-neutral-800 rounded-2xl shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Operations Center</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Real-time threat monitoring, audit analysis, and security posture overview
        </p>
      </div>

      {/* Threat Score Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Threat Score */}
            <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200/60 dark:border-neutral-800/60">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="currentColor"
                    className="text-neutral-100 dark:text-neutral-800"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="currentColor"
                    className={threatColor}
                    strokeWidth="8"
                    strokeDasharray={`${(threatScore / 100) * 327} 327`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${threatColor}`}>{threatScore}</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Score</div>
                </div>
              </div>
              <div className={`text-sm font-semibold mt-3 ${threatColor}`}>{threatLevel}</div>
              <div className="text-xs text-neutral-400 mt-0.5">Overall Threat Level</div>
            </div>

            {/* Security Metrics */}
            <div className="col-span-2 p-6">
              <h3 className="text-sm font-semibold mb-4">Security Posture</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Wifi,
                    label: "System Status",
                    value: "Online",
                    detail: "All systems operational",
                    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
                  },
                  {
                    icon: Shield,
                    label: "RBAC Engine",
                    value: "Active",
                    detail: "3 roles configured",
                    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
                  },
                  {
                    icon: Lock,
                    label: "JWT Auth",
                    value: "HS256",
                    detail: "30-min token expiry",
                    color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/40",
                  },
                  {
                    icon: Eye,
                    label: "Audit Log",
                    value: `${summary?.total_events || 0}`,
                    detail: "Events captured",
                    color: "text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800",
                  },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/20">
                    <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center justify-center shrink-0`}>
                      <m.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">{m.label}</div>
                      <div className="text-sm font-semibold">{m.value}</div>
                      <div className="text-[10px] text-neutral-400">{m.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Events", value: summary.total_events, pct: 100, color: "bg-neutral-900 dark:bg-neutral-100" },
            { label: "High Risk", value: summary.high_risk_events, pct: (summary.high_risk_events / Math.max(summary.total_events, 1)) * 100, color: "bg-red-500" },
            { label: "Pending", value: summary.pending_reviews, pct: (summary.pending_reviews / Math.max(summary.total_events, 1)) * 100, color: "bg-amber-500" },
            { label: "Approved", value: summary.approved_events, pct: (summary.approved_events / Math.max(summary.total_events, 1)) * 100, color: "bg-emerald-500" },
          ].map((item) => (
            <Card key={item.label} className="metric-card">
              <CardContent className="p-5">
                <div className="text-xs text-neutral-400 mb-1">{item.label}</div>
                <div className="text-2xl font-bold tracking-tight mb-2">{item.value}</div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${Math.max(item.pct, 2)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Events List with Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Audit Events</CardTitle>
              <CardDescription>Comprehensive log of all access events</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high">High Risk</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-16 text-sm text-neutral-400">
                  No events match the current filter
                </div>
              ) : (
                filteredEvents.map((evt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        evt.risk_level === "high"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : evt.status === "approved"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {evt.risk_level === "high" ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : evt.status === "approved" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{evt.user_email}</span>
                        <Badge
                          variant={
                            evt.risk_level === "high"
                              ? "destructive"
                              : evt.status === "approved"
                              ? "success"
                              : "warning"
                          }
                        >
                          {evt.risk_level === "high" ? "HIGH RISK" : evt.status}
                        </Badge>
                        {evt.alert_flag && (
                          <Badge variant="destructive">ALERT</Badge>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Patient {evt.patient_id} -- {evt.access_type} -- {evt.reason}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400 shrink-0 text-right">
                      {evt.timestamp
                        ? new Date(evt.timestamp).toLocaleDateString()
                        : "-"}
                      <br />
                      <span className="text-[10px]">
                        {evt.timestamp
                          ? new Date(evt.timestamp).toLocaleTimeString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
