"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminApi, accessApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Users,
  AlertTriangle,
} from "lucide-react";

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

export default function AccessReviewsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const data = await adminApi.getAccessLogs(token);
      setEvents(data.recent_events);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleReview = async (
    patientId: string,
    userEmail: string,
    approve: boolean
  ) => {
    if (!token) return;
    setActionLoading(`${patientId}-${userEmail}-${approve}`);
    try {
      await accessApi.reviewRequest(patientId, userEmail, approve, token);
      await fetchEvents();
    } catch {
      // silent fail
    } finally {
      setActionLoading(null);
    }
  };

  const pendingEvents = events.filter((e) => e.status === "pending");
  const resolvedEvents = events.filter((e) => e.status !== "pending");

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg shimmer" />
        <div className="h-[300px] bg-neutral-100 dark:bg-neutral-800 rounded-2xl shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Access Reviews</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review and approve or deny break-glass and access requests
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="metric-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingEvents.length}</div>
              <div className="text-xs text-neutral-400">Pending Reviews</div>
            </div>
          </CardContent>
        </Card>
        <Card className="metric-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {resolvedEvents.filter((e) => e.status === "approved").length}
              </div>
              <div className="text-xs text-neutral-400">Approved</div>
            </div>
          </CardContent>
        </Card>
        <Card className="metric-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {events.filter((e) => e.risk_level === "high").length}
              </div>
              <div className="text-xs text-neutral-400">High Risk</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Pending Reviews</CardTitle>
              <CardDescription>
                Break-glass and access requests awaiting your decision
              </CardDescription>
            </div>
            {pendingEvents.length > 0 && (
              <Badge variant="warning">{pendingEvents.length} pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {pendingEvents.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-12 h-12 text-neutral-200 dark:text-neutral-700 mx-auto mb-3" />
                  <div className="text-sm text-neutral-400">All reviews are up to date</div>
                </div>
              ) : (
                pendingEvents.map((evt, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      evt.risk_level === "high"
                        ? "border-red-200/60 dark:border-red-800/40 bg-red-50/30 dark:bg-red-950/10"
                        : "border-neutral-200/60 dark:border-neutral-800/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{evt.user_email}</span>
                          {evt.risk_level === "high" && (
                            <Badge variant="destructive">HIGH RISK</Badge>
                          )}
                          {evt.access_type === "break_glass" && (
                            <Badge variant="warning">BREAK-GLASS</Badge>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Patient: {evt.patient_id} -- {evt.access_type}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {evt.reason || "No reason provided"}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-1">
                          {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : "-"}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
                          onClick={() =>
                            handleReview(evt.patient_id, evt.user_email, true)
                          }
                          disabled={actionLoading !== null}
                        >
                          {actionLoading ===
                          `${evt.patient_id}-${evt.user_email}-true` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
                          onClick={() =>
                            handleReview(evt.patient_id, evt.user_email, false)
                          }
                          disabled={actionLoading !== null}
                        >
                          {actionLoading ===
                          `${evt.patient_id}-${evt.user_email}-false` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
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
