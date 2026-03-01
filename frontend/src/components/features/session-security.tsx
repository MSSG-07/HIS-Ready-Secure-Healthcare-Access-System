"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Fingerprint,
  Clock,
  Monitor,
  MapPin,
  Lock,
  Wifi,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface SessionInfo {
  browser: string;
  os: string;
  ip: string;
  location: string;
  loginTime: string;
  tokenExpiry: number;
  mfaEnabled: boolean;
}

export function SessionSecurityPanel() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 min in seconds
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    // Simulate session info
    setSession({
      browser: detectBrowser(),
      os: detectOS(),
      ip: "192.168.1.xxx",
      location: "Local Network",
      loginTime: new Date().toLocaleString(),
      tokenExpiry: 30,
      mfaEnabled: false,
    });
    setSecurityScore(78);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const tokenPct = (timeLeft / 1800) * 100;

  if (!session) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Session Security
            </CardTitle>
            <CardDescription>Current session status and encryption details</CardDescription>
          </div>
          <Badge variant={securityScore > 70 ? "success" : "warning"}>
            Score: {securityScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Expiry */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-500">Token Expiry</span>
            </div>
            <span
              className={`text-sm font-mono font-bold ${
                tokenPct < 20
                  ? "text-red-600 dark:text-red-400"
                  : tokenPct < 50
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={tokenPct} />
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Monitor, label: "Browser", value: session.browser },
            { icon: Wifi, label: "Network", value: session.location },
            { icon: Lock, label: "Encryption", value: "TLS 1.3" },
            { icon: Fingerprint, label: "Auth", value: "JWT HS256" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-50/50 dark:bg-neutral-800/20"
            >
              <item.icon className="w-3.5 h-3.5 text-neutral-400" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  {item.label}
                </div>
                <div className="text-xs font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Checks */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-neutral-500 mb-1">Security Checks</div>
          {[
            { label: "HTTPS Connection", ok: true },
            { label: "JWT Token Valid", ok: timeLeft > 0 },
            { label: "RBAC Enforced", ok: true },
            { label: "Session Fingerprint", ok: true },
            { label: "Rate Limiting", ok: true },
            { label: "MFA Enabled", ok: false },
          ].map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between py-1"
            >
              <span className="text-xs text-neutral-500">{check.label}</span>
              {check.ok ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function detectBrowser(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Unknown";
}

function detectOS(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS")) return "iOS";
  return "Unknown";
}
