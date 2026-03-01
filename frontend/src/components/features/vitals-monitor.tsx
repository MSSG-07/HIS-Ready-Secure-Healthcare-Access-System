"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface VitalSign {
  label: string;
  value: number;
  unit: string;
  icon: typeof Heart;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  color: string;
  history: number[];
}

export function VitalsMonitor() {
  const [vitals, setVitals] = useState<VitalSign[]>([
    {
      label: "Heart Rate",
      value: 72,
      unit: "bpm",
      icon: Heart,
      min: 40,
      max: 180,
      normalMin: 60,
      normalMax: 100,
      color: "text-red-500",
      history: [72, 74, 71, 73, 72, 75, 73, 72],
    },
    {
      label: "SpO2",
      value: 98,
      unit: "%",
      icon: Droplets,
      min: 85,
      max: 100,
      normalMin: 95,
      normalMax: 100,
      color: "text-blue-500",
      history: [98, 97, 98, 99, 98, 97, 98, 98],
    },
    {
      label: "Temperature",
      value: 36.6,
      unit: "C",
      icon: Thermometer,
      min: 35,
      max: 42,
      normalMin: 36.1,
      normalMax: 37.2,
      color: "text-amber-500",
      history: [36.5, 36.6, 36.7, 36.6, 36.5, 36.6, 36.6, 36.6],
    },
    {
      label: "Resp. Rate",
      value: 16,
      unit: "/min",
      icon: Wind,
      min: 8,
      max: 40,
      normalMin: 12,
      normalMax: 20,
      color: "text-emerald-500",
      history: [15, 16, 16, 17, 15, 16, 16, 16],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prev) =>
        prev.map((v) => {
          const delta = (Math.random() - 0.5) * 2;
          const newVal =
            v.label === "Temperature"
              ? Math.round((v.value + delta * 0.1) * 10) / 10
              : Math.round(v.value + delta);
          const clamped = Math.max(v.min, Math.min(v.max, newVal));
          return {
            ...v,
            value: clamped,
            history: [...v.history.slice(-19), clamped],
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Vitals Monitor
            </CardTitle>
            <CardDescription>Real-time patient vital signs simulation</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-400">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {vitals.map((vital) => {
            const isNormal =
              vital.value >= vital.normalMin && vital.value <= vital.normalMax;
            const lastVal = vital.history[vital.history.length - 2] || vital.value;
            const trend = vital.value - lastVal;

            return (
              <div
                key={vital.label}
                className={`p-4 rounded-xl border transition-colors ${
                  isNormal
                    ? "border-neutral-200/60 dark:border-neutral-800/60"
                    : "border-red-200/60 dark:border-red-800/40 bg-red-50/30 dark:bg-red-950/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <vital.icon className={`w-4 h-4 ${vital.color}`} />
                  {isNormal ? (
                    <Badge variant="success" className="text-[9px] px-1.5 py-0">
                      Normal
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                      Alert
                    </Badge>
                  )}
                </div>
                <div className="text-xl font-bold tracking-tight">
                  {vital.value}
                  <span className="text-xs font-normal text-neutral-400 ml-1">
                    {vital.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-neutral-400">{vital.label}</span>
                  {trend > 0 ? (
                    <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                  ) : trend < 0 ? (
                    <TrendingDown className="w-2.5 h-2.5 text-red-500" />
                  ) : (
                    <Minus className="w-2.5 h-2.5 text-neutral-400" />
                  )}
                </div>
                {/* Mini sparkline */}
                <div className="mt-2 flex items-end gap-px h-6">
                  {vital.history.slice(-12).map((val, i) => {
                    const range = vital.max - vital.min;
                    const pct = ((val - vital.min) / range) * 100;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm transition-all duration-300 ${
                          val >= vital.normalMin && val <= vital.normalMax
                            ? "bg-neutral-300 dark:bg-neutral-600"
                            : "bg-red-400 dark:bg-red-500"
                        }`}
                        style={{ height: `${Math.max(8, pct)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
