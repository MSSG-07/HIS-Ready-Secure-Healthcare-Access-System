"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { patientApi, accessApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VitalsMonitor } from "@/components/features/vitals-monitor";
import { SessionSecurityPanel } from "@/components/features/session-security";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  FileText,
  AlertTriangle,
  Loader2,
  User,
  Heart,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface PatientData {
  patient_id: string;
  name: string;
  age: number;
  condition: string;
}

export function DoctorDashboard() {
  const { token } = useAuth();
  const [searchId, setSearchId] = useState("");
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Access request state
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestPatientId, setRequestPatientId] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  // Emergency access state
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [emergencyPatientId, setEmergencyPatientId] = useState("");
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState<PatientData | null>(null);

  const lookupPatient = async () => {
    if (!searchId.trim() || !token) return;
    setSearching(true);
    setSearchError("");
    setPatient(null);
    try {
      const res = await patientApi.get(searchId.trim(), token);
      setPatient(res.patient);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Patient not found or access denied";
      setSearchError(message);
    } finally {
      setSearching(false);
    }
  };

  const submitAccessRequest = async () => {
    if (!requestPatientId.trim() || !requestReason.trim() || !token) return;
    setRequesting(true);
    setRequestMessage("");
    try {
      const res = await accessApi.requestAccess(requestPatientId.trim(), requestReason.trim(), token);
      setRequestMessage(res.message);
      setTimeout(() => {
        setRequestDialogOpen(false);
        setRequestMessage("");
        setRequestPatientId("");
        setRequestReason("");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      setRequestMessage(message);
    } finally {
      setRequesting(false);
    }
  };

  const triggerEmergencyAccess = async () => {
    if (!emergencyPatientId.trim() || !token) return;
    setEmergencyLoading(true);
    setEmergencyResult(null);
    try {
      const res = await patientApi.get(emergencyPatientId.trim(), token, true);
      setEmergencyResult(res.patient);
    } catch (err: unknown) {
      setEmergencyResult(null);
    } finally {
      setEmergencyLoading(false);
    }
  };

  const quickActions = [
    { label: "P1001", sub: "Arjun Nair" },
    { label: "P008", sub: "Meera Pillai" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Doctor Portal</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Patient records, access requests, and emergency protocols
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="metric-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-500">Patient Lookup</div>
                <div className="text-xs text-neutral-400">Search by ID</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="metric-card cursor-pointer"
          onClick={() => setRequestDialogOpen(true)}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-500">Request Access</div>
                <div className="text-xs text-neutral-400">Submit for review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="metric-card cursor-pointer"
          onClick={() => setEmergencyDialogOpen(true)}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-500">Emergency Access</div>
                <div className="text-xs text-neutral-400">Break-glass protocol</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Patient Lookup</CardTitle>
          <CardDescription>Search for assigned patients by their ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Patient ID (e.g. P1001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookupPatient()}
              />
            </div>
            <Button onClick={lookupPatient} disabled={searching} className="gap-2">
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </Button>
          </div>

          {/* Quick Access */}
          <div className="flex gap-2 mt-3">
            <span className="text-xs text-neutral-400 py-1">Quick:</span>
            {quickActions.map((q) => (
              <button
                key={q.label}
                onClick={() => {
                  setSearchId(q.label);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {q.label}
                <span className="text-neutral-400 dark:text-neutral-500">{q.sub}</span>
              </button>
            ))}
          </div>

          {searchError && (
            <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {searchError}
            </div>
          )}

          {patient && (
            <div className="mt-5">
              <PatientCard patient={patient} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Innovative Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VitalsMonitor />
        <SessionSecurityPanel />
      </div>

      {/* Access Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Patient Access</DialogTitle>
            <DialogDescription>
              Submit a formal access request to the administrator for review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Patient ID</Label>
              <Input
                placeholder="e.g. P1001"
                value={requestPatientId}
                onChange={(e) => setRequestPatientId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Describe the clinical reason for access..."
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                rows={3}
              />
            </div>
            {requestMessage && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                {requestMessage}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAccessRequest} disabled={requesting}>
              {requesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Access Dialog */}
      <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
        <DialogContent className="border-red-200/60 dark:border-red-800/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Break-Glass Emergency Access
            </DialogTitle>
            <DialogDescription>
              This will trigger an emergency override to access an unassigned patient record.
              A 72-hour audit trail will be created and flagged for admin review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/40 p-4">
              <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                WARNING
              </div>
              <div className="text-xs text-red-500 dark:text-red-400 leading-relaxed">
                This action is logged, time-limited (72h), and will be reviewed by administration.
                Only use this for genuine clinical emergencies.
              </div>
            </div>
            <div className="space-y-2">
              <Label>Patient ID</Label>
              <Input
                placeholder="e.g. P9999"
                value={emergencyPatientId}
                onChange={(e) => setEmergencyPatientId(e.target.value)}
              />
            </div>

            {emergencyResult && (
              <div className="mt-2">
                <PatientCard patient={emergencyResult} emergency />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmergencyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={triggerEmergencyAccess}
              disabled={emergencyLoading}
            >
              {emergencyLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accessing...
                </>
              ) : (
                "Activate Emergency Access"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PatientCard({
  patient,
  emergency = false,
}: {
  patient: PatientData;
  emergency?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        emergency
          ? "border-red-200/60 dark:border-red-800/40 bg-red-50/30 dark:bg-red-950/10"
          : "border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-800/20"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            emergency
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          }`}
        >
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold">{patient.name}</h3>
            {emergency && <Badge variant="destructive">Emergency</Badge>}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">ID</div>
                <div className="text-sm font-medium">{patient.patient_id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Age</div>
                <div className="text-sm font-medium">{patient.age}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-neutral-400" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Condition
                </div>
                <div className="text-sm font-medium">{patient.condition}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
