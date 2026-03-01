"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { patientApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Loader2,
  ShieldAlert,
  User,
  Heart,
  Calendar,
  FileText,
  Clock,
  Shield,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PatientData {
  patient_id: string;
  name: string;
  age: number;
  condition: string;
}

export default function EmergencyAccessPage() {
  const { token } = useAuth();
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [error, setError] = useState("");
  const [activated, setActivated] = useState(false);

  const triggerEmergency = async () => {
    if (!patientId.trim() || !token) return;
    setLoading(true);
    setError("");
    setPatient(null);
    try {
      const res = await patientApi.get(patientId.trim(), token, true);
      setPatient(res.patient);
      setActivated(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Emergency access failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency Access</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Break-glass protocol for critical patient situations
        </p>
      </div>

      {/* Warning Banner */}
      <Card className="border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              Break-Glass Protocol
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed">
              Emergency access overrides normal RBAC controls. This action creates an immediate
              audit trail, grants 72-hour temporary access, and triggers an admin review alert.
              Use only for genuine clinical emergencies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Protocol Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: "1",
            title: "Activate",
            desc: "Enter the patient ID and confirm the emergency override",
            icon: ShieldAlert,
            color: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
          },
          {
            step: "2",
            title: "72h Window",
            desc: "Access is granted for 72 hours with full audit logging",
            icon: Clock,
            color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
          },
          {
            step: "3",
            title: "Admin Review",
            desc: "Administrator reviews and approves or revokes the access",
            icon: Shield,
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

      {/* Emergency Form */}
      <Card className="border-red-200/40 dark:border-red-800/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
            Activate Emergency Override
          </CardTitle>
          <CardDescription>
            Enter the patient ID to trigger break-glass access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Patient ID</Label>
            <Input
              placeholder="e.g. P9999"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!patientId.trim() || loading}
                className="gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Activate Break-Glass
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Confirm Emergency Access
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to activate break-glass emergency access for patient{" "}
                  <strong>{patientId}</strong>. This action will:
                  <br /><br />
                  -- Create an immediate high-risk audit entry
                  <br />
                  -- Grant 72-hour temporary access
                  <br />
                  -- Alert administrators for mandatory review
                  <br /><br />
                  This cannot be undone. Proceed only for genuine emergencies.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={triggerEmergency}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    "Confirm Emergency Override"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Activated result */}
          {activated && patient && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="absolute inset-0 rounded-full bg-red-400 pulse-ring" />
                </div>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Emergency Access Active
                </span>
                <Badge variant="destructive">72h remaining</Badge>
              </div>

              <div className="rounded-xl border border-red-200/60 dark:border-red-800/40 bg-red-50/30 dark:bg-red-950/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">{patient.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          ID
                        </div>
                        <div className="text-sm font-medium">{patient.patient_id}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Age
                        </div>
                        <div className="text-sm font-medium">{patient.age}</div>
                      </div>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
