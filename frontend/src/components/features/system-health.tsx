"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Database,
  Server,
  Lock,
  Wifi,
  Cpu,
  HardDrive,
  Activity,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latency: number;
  uptime: number;
  icon: typeof Server;
}

export function SystemHealthMonitor() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const generateServices = (): ServiceStatus[] => [
    {
      name: "API Gateway",
      status: "operational",
      latency: Math.floor(Math.random() * 30) + 5,
      uptime: 99.97,
      icon: Globe,
    },
    {
      name: "Auth Service",
      status: "operational",
      latency: Math.floor(Math.random() * 20) + 3,
      uptime: 99.99,
      icon: Lock,
    },
    {
      name: "MongoDB",
      status: Math.random() > 0.1 ? "operational" : "degraded",
      latency: Math.floor(Math.random() * 15) + 2,
      uptime: 99.95,
      icon: Database,
    },
    {
      name: "HIS Adapter",
      status: Math.random() > 0.05 ? "operational" : "degraded",
      latency: Math.floor(Math.random() * 50) + 10,
      uptime: 99.9,
      icon: Server,
    },
    {
      name: "RBAC Engine",
      status: "operational",
      latency: Math.floor(Math.random() * 5) + 1,
      uptime: 100,
      icon: Cpu,
    },
    {
      name: "Audit Logger",
      status: "operational",
      latency: Math.floor(Math.random() * 10) + 2,
      uptime: 99.98,
      icon: HardDrive,
    },
  ];

  useEffect(() => {
    setServices(generateServices());
    const interval = setInterval(() => {
      setServices(generateServices());
      setLastCheck(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setServices(generateServices());
      setLastCheck(new Date());
      setRefreshing(false);
    }, 500);
  };

  const allOperational = services.every((s) => s.status === "operational");
  const avgLatency =
    services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + s.latency, 0) / services.length)
      : 0;

  const statusConfig = {
    operational: {
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      badge: "success" as const,
    },
    degraded: {
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      badge: "warning" as const,
    },
    down: {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
      badge: "destructive" as const,
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Health
            </CardTitle>
            <CardDescription>Infrastructure and service status monitoring</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={refresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Badge variant={allOperational ? "success" : "warning"}>
              {allOperational ? "All Systems Go" : "Degraded"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 mb-1">
          <div className="text-center p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/30">
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {services.filter((s) => s.status === "operational").length}/{services.length}
            </div>
            <div className="text-[10px] text-neutral-400">Healthy</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/30">
            <div className="text-sm font-bold">{avgLatency}ms</div>
            <div className="text-[10px] text-neutral-400">Avg Latency</div>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/30">
            <div className="text-sm font-bold">99.9%</div>
            <div className="text-[10px] text-neutral-400">Uptime</div>
          </div>
        </div>

        {/* Service List */}
        <div className="space-y-1.5">
          {services.map((service) => {
            const config = statusConfig[service.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={service.name}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <service.icon className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {service.latency}ms
                  </span>
                  <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-neutral-400 text-right pt-1">
          Last checked: {lastCheck.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
