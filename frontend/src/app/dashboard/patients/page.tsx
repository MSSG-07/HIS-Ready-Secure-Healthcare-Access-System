"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { patientApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  User,
  Heart,
  Calendar,
  FileText,
  Activity,
  Clock,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface PatientData {
  patient_id: string;
  name: string;
  age: number;
  condition: string;
}

export default function PatientsPage() {
  const { user, token } = useAuth();
  const [searchId, setSearchId] = useState("");
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const lookupPatient = async () => {
    if (!searchId.trim() || !token) return;
    setSearching(true);
    setError("");
    setPatient(null);
    try {
      const res = await patientApi.get(searchId.trim(), token);
      setPatient(res.patient);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Patient not found or access denied";
      setError(message);
    } finally {
      setSearching(false);
    }
  };

  const samplePatients = [
    { id: "P1001", name: "Arjun Nair", condition: "Hypertension" },
    { id: "P008", name: "Meera Pillai", condition: "Asthma" },
    { id: "P9999", name: "Emergency Case", condition: "Cardiac Arrest" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {user?.role === "admin" ? "Patient Lookup" : "My Patients"}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {user?.role === "admin"
            ? "Search and view any patient record in the system"
            : "View records for your assigned patients"}
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Patient ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookupPatient()}
                className="h-12 text-base"
              />
            </div>
            <Button onClick={lookupPatient} disabled={searching} size="lg" className="gap-2 px-6">
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Lookup
            </Button>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {samplePatients.map((p) => (
              <button
                key={p.id}
                onClick={() => setSearchId(p.id)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <span className="text-neutral-900 dark:text-neutral-100">{p.id}</span>
                <span className="text-neutral-400">{p.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 px-5 py-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Patient Result */}
      {patient && (
        <div className="space-y-4">
          {/* Patient Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold">{patient.name}</h2>
                    <Badge variant="secondary">{patient.patient_id}</Badge>
                    <Badge variant="success">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Patient record retrieved from HIS adapter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="metric-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    Patient ID
                  </span>
                </div>
                <div className="text-lg font-bold">{patient.patient_id}</div>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Age</span>
                </div>
                <div className="text-lg font-bold">{patient.age} years</div>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <Heart className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">
                    Condition
                  </span>
                </div>
                <div className="text-lg font-bold">{patient.condition}</div>
              </CardContent>
            </Card>
          </div>

          {/* Mock Clinical Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clinical Timeline</CardTitle>
              <CardDescription>Recent interactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
                <div className="space-y-4">
                  {[
                    {
                      time: "Today",
                      event: "Record accessed via MedVault portal",
                      type: "access",
                      icon: Eye,
                    },
                    {
                      time: "2 days ago",
                      event: "Vital signs updated -- BP: 130/85 mmHg",
                      type: "update",
                      icon: Activity,
                    },
                    {
                      time: "1 week ago",
                      event: "Prescription renewed -- Amlodipine 5mg",
                      type: "rx",
                      icon: FileText,
                    },
                    {
                      time: "2 weeks ago",
                      event: "Follow-up appointment completed",
                      type: "visit",
                      icon: Clock,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center z-10">
                        <item.icon className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-xs text-neutral-400 mb-0.5">{item.time}</div>
                        <div className="text-sm">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
