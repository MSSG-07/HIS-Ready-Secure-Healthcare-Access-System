"use client";

import { useEffect, useState, useCallback } from "react";
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

interface AccessRequest {
  user_email: string;
  patient_id: string;
  reason: string;
  status: string;
  requested_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
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

interface CombinedReview {
  user_email: string;
  patient_id: string;
  reason: string;
  status: string;
  timestamp: string;
  type: "access_request" | "break_glass";
  risk_level?: string;
}

export default function AccessReviewsPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!token) return;
    try {
      const [requestsData, logsData] = await Promise.all([
        adminApi.getAccessRequests(token),
        adminApi.getAccessLogs(token),
      ]);
      setRequests(requestsData.requests);
      setAuditEvents(logsData.recent_events);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleReview = async (
    patientId: string,
    userEmail: string,
    approve: boolean
  ) => {
    if (!token) return;
    setActionLoading(`${patientId}-${userEmail}-${approve}`);
    try {
      await accessApi.reviewRequest(patientId, userEmail, approve, token);
      await fetchRequests();
    } catch {
      // silent fail
    } finally {
      setActionLoading(null);
    }
  };

  // Combine access requests and break-glass events that are pending
  const combinedReviews: CombinedReview[] = [
    ...requests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        user_email: r.user_email,
        patient_id: r.patient_id,
        reason: r.reason,
        status: r.status,
        timestamp: r.requested_at,
        type: "access_request" as const,
      })),
    ...auditEvents
      .filter((e) => e.access_type === "break_glass" && e.status === "pending")
      .map((e) => ({
        user_email: e.user_email,
        patient_id: e.patient_id,
        reason: e.reason,
        status: e.status,
        timestamp: e.timestamp,
        type: "break_glass" as const,
        risk_level: e.risk_level,
      })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const pendingCount = combinedReviews.length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

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
              <div className="text-2xl font-bold">{pendingCount}</div>
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
              <div className="text-2xl font-bold">{approvedCount}</div>
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
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <div className="text-xs text-neutral-400">Rejected</div>
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
                Access requests and break-glass events awaiting your decision
              </CardDescription>
            </div>
            {pendingCount > 0 && (
              <Badge variant="warning">{pendingCount} pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {combinedReviews.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-12 h-12 text-neutral-200 dark:text-neutral-700 mx-auto mb-3" />
                  <div className="text-sm text-neutral-400">All reviews are up to date</div>
                </div>
              ) : (
                combinedReviews.map((item, i) => (
                  <div
                    key={`${item.type}-${item.patient_id}-${item.user_email}-${i}`}
                    className={`p-4 rounded-xl border ${
                      item.type === "break_glass"
                        ? "border-red-200/60 dark:border-red-800/40 bg-red-50/30 dark:bg-red-950/10"
                        : "border-neutral-200/60 dark:border-neutral-800/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{item.user_email}</span>
                          {item.type === "break_glass" ? (
                            <Badge variant="destructive">BREAK-GLASS</Badge>
                          ) : (
                            <Badge variant="warning">PENDING</Badge>
                          )}
                          {item.risk_level === "high" && (
                            <Badge variant="destructive">HIGH RISK</Badge>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Patient: {item.patient_id}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {item.reason || "No reason provided"}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-1">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : "-"}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
                          onClick={() =>
                            handleReview(item.patient_id, item.user_email, true)
                          }
                          disabled={actionLoading !== null}
                        >
                          {actionLoading ===
                          `${item.patient_id}-${item.user_email}-true` ? (
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
                            handleReview(item.patient_id, item.user_email, false)
                          }
                          disabled={actionLoading !== null}
                        >
                          {actionLoading ===
                          `${item.patient_id}-${item.user_email}-false` ? (
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
