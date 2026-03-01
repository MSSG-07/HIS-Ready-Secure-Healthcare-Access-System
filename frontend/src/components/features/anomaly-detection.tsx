"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  ShieldAlert,
  Eye,
  Clock,
  Zap,
  TrendingUp,
  MapPin,
  User,
} from "lucide-react";

interface AnomalyEvent {
  id: string;
  type: "brute_force" | "unusual_time" | "geo_anomaly" | "privilege_escalation" | "data_exfil";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  source: string;
  timestamp: Date;
  details: string;
}

const severityConfig = {
  low: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    badge: "secondary" as const,
  },
  medium: {
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    badge: "warning" as const,
  },
  high: {
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    badge: "warning" as const,
  },
  critical: {
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    badge: "destructive" as const,
  },
};

const anomalyTemplates: Omit<AnomalyEvent, "id" | "timestamp">[] = [
  {
    type: "brute_force",
    severity: "high",
    message: "Multiple failed login attempts detected",
    source: "auth_service",
    details: "5 failed attempts from 192.168.1.105 in 2 minutes",
  },
  {
    type: "unusual_time",
    severity: "medium",
    message: "Login outside normal hours",
    source: "session_monitor",
    details: "User access at 03:24 AM -- typically active 08:00-18:00",
  },
  {
    type: "geo_anomaly",
    severity: "critical",
    message: "Impossible travel detected",
    source: "geo_analyzer",
    details: "Login from two locations 5000km apart within 30 minutes",
  },
  {
    type: "privilege_escalation",
    severity: "high",
    message: "Unauthorized role change attempt",
    source: "rbac_engine",
    details: "Attempt to access admin endpoint with doctor credentials",
  },
  {
    type: "data_exfil",
    severity: "critical",
    message: "Bulk patient data access",
    source: "data_monitor",
    details: "50+ patient records accessed in rapid succession",
  },
  {
    type: "brute_force",
    severity: "medium",
    message: "Rate limit threshold approaching",
    source: "api_gateway",
    details: "80% of rate limit consumed -- 45 requests in 60 seconds",
  },
  {
    type: "unusual_time",
    severity: "low",
    message: "First-time device detected",
    source: "device_tracker",
    details: "New browser fingerprint -- Chrome on Linux",
  },
];

const typeIcons = {
  brute_force: ShieldAlert,
  unusual_time: Clock,
  geo_anomaly: MapPin,
  privilege_escalation: Zap,
  data_exfil: Eye,
};

export function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, resolved: 0 });

  useEffect(() => {
    // Initialize with some events
    const initial = anomalyTemplates.slice(0, 3).map((t, i) => ({
      ...t,
      id: `init-${i}`,
      timestamp: new Date(Date.now() - (i + 1) * 300000),
    }));
    setAnomalies(initial);
    updateStats(initial);

    // Add new events periodically for demo
    const interval = setInterval(() => {
      const template =
        anomalyTemplates[Math.floor(Math.random() * anomalyTemplates.length)];
      const newEvent: AnomalyEvent = {
        ...template,
        id: `evt-${Date.now()}`,
        timestamp: new Date(),
      };
      setAnomalies((prev) => {
        const updated = [newEvent, ...prev].slice(0, 20);
        updateStats(updated);
        return updated;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const updateStats = (events: AnomalyEvent[]) => {
    setStats({
      total: events.length,
      critical: events.filter((e) => e.severity === "critical").length,
      high: events.filter((e) => e.severity === "high").length,
      resolved: Math.floor(events.length * 0.6),
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>
              AI-powered behavioral analysis and threat detection
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 pulse-glow" />
            <span className="text-xs text-neutral-400">Monitoring</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Detected", value: stats.total, color: "text-neutral-900 dark:text-neutral-100" },
            { label: "Critical", value: stats.critical, color: "text-red-600 dark:text-red-400" },
            { label: "High", value: stats.high, color: "text-amber-600 dark:text-amber-400" },
            { label: "Resolved", value: stats.resolved, color: "text-emerald-600 dark:text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="text-center p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/30">
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Anomaly Feed */}
        <ScrollArea className="h-[320px]">
          <div className="space-y-2">
            {anomalies.map((event) => {
              const Icon = typeIcons[event.type];
              const config = severityConfig[event.severity];
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold truncate">{event.message}</span>
                      <Badge variant={config.badge} className="text-[9px] shrink-0">
                        {event.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-neutral-400">{event.details}</div>
                    <div className="text-[10px] text-neutral-300 dark:text-neutral-600 mt-0.5">
                      {event.source} -- {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
