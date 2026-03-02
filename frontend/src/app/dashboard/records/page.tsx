"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { accessApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Loader2,
  Calendar,
  User,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";

interface MedicalRecord {
  patient_id: string;
  doctor_email: string;
  record_type: string;
  notes: string;
  created_at: string;
}

export default function RecordsPage() {
  const { user, token } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) return;

    const patientId = user.patient_id;
    if (!patientId) {
      setError("No patient ID linked to your account. Please contact an administrator.");
      setLoading(false);
      return;
    }

    const loadRecords = async () => {
      try {
        const res = await accessApi.getMedicalRecords(patientId, token);
        setRecords(res.records);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load records";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [user, token]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Medical Records</h1>
        <p className="text-sm text-neutral-500 mt-1">
          View your health records added by your care team
        </p>
      </div>

      {/* Patient Info */}
      {user.patient_id && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/40 dark:border-blue-800/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-neutral-900/80 shadow-sm flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-neutral-500">
                  Patient ID: {user.patient_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <span className="ml-2 text-sm text-neutral-500">Loading records...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 dark:border-red-800/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Records */}
      {!loading && !error && records.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center">
            <ClipboardList className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-500">No records found</p>
            <p className="text-xs text-neutral-400 mt-1">
              Your medical records will appear here once your care team adds them.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      {!loading && records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Records ({records.length})
            </CardTitle>
            <CardDescription>
              All medical records on file for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-3">
                {records.map((record, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {record.record_type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {record.notes}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
                      <User className="w-3 h-3" />
                      Dr. {record.doctor_email}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
