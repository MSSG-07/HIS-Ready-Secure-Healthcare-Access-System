"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { accessApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Loader2,
  CheckCircle2,
  Send,
  Clock,
  Shield,
} from "lucide-react";

export default function AccessRequestsPage() {
  const { token } = useAuth();
  const [patientId, setPatientId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim() || !reason.trim() || !token) return;
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const res = await accessApi.requestAccess(patientId.trim(), reason.trim(), token);
      setMessage(res.message);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setMessage(msg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Access Requests</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Request access to patient records for clinical review
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: "1",
            title: "Submit Request",
            desc: "Provide the patient ID and your clinical reason for access",
            icon: Send,
            color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
          },
          {
            step: "2",
            title: "Admin Review",
            desc: "An administrator reviews your request and clinical justification",
            icon: Shield,
            color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
          },
          {
            step: "3",
            title: "Access Granted",
            desc: "Once approved, the patient is added to your assigned list",
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
          },
        ].map((item) => (
          <Card key={item.step} className="metric-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider">
                  Step {item.step}
                </div>
              </div>
              <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4.5 h-4.5" />
            New Access Request
          </CardTitle>
          <CardDescription>
            Submit a formal request for patient record access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Request Submitted</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Your access request is pending administrator review
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                Awaiting review
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setPatientId("");
                    setReason("");
                    setMessage("");
                  }}
                >
                  Submit Another Request
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input
                  placeholder="e.g. P1001"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Clinical Reason</Label>
                <Textarea
                  placeholder="Describe your clinical justification for accessing this patient's records..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={4}
                />
                <p className="text-[10px] text-neutral-400">
                  Provide sufficient detail for the administrator to evaluate your request
                </p>
              </div>

              {message && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm border ${
                    isError
                      ? "bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/40 text-red-600 dark:text-red-400"
                      : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
