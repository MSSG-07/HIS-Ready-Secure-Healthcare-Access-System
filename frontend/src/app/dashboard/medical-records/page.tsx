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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Plus,
  Loader2,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface MedicalRecord {
  patient_id: string;
  doctor_email: string;
  record_type: string;
  notes: string;
  created_at: string;
}

export default function MedicalRecordsPage() {
  const { token } = useAuth();
  const [patientId, setPatientId] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add record dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  const loadRecords = async () => {
    if (!patientId.trim() || !token) return;
    setLoading(true);
    setError("");
    setRecords([]);
    try {
      const res = await accessApi.getMedicalRecords(patientId.trim(), token);
      setRecords(res.records);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load records";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!patientId.trim() || !recordType.trim() || !notes.trim() || !token) return;
    setAdding(true);
    setAddMessage("");
    try {
      await accessApi.addMedicalRecord(patientId.trim(), recordType.trim(), notes.trim(), token);
      setAddMessage("Record added successfully");
      setTimeout(() => {
        setAddDialogOpen(false);
        setAddMessage("");
        setRecordType("");
        setNotes("");
        loadRecords();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add record";
      setAddMessage(message);
    } finally {
      setAdding(false);
    }
  };

  const quickPatients = [
    { label: "P1001", sub: "Arjun Nair" },
    { label: "P008", sub: "Meera Pillai" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
        <p className="text-sm text-neutral-500 mt-1">
          View and add medical records for your assigned patients
        </p>
      </div>

      {/* Patient Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Patient</CardTitle>
          <CardDescription>Enter the patient ID to view and manage records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Patient ID (e.g. P1001)"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadRecords()}
              />
            </div>
            <Button onClick={loadRecords} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Load Records
            </Button>
          </div>

          {/* Quick Access */}
          <div className="flex gap-2 mt-3">
            <span className="text-xs text-neutral-400 py-1">Quick:</span>
            {quickPatients.map((q) => (
              <button
                key={q.label}
                onClick={() => {
                  setPatientId(q.label);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {q.label}
                <span className="text-neutral-400 dark:text-neutral-500">{q.sub}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Records List */}
      {records.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Medical Records for {patientId}</CardTitle>
                <CardDescription>
                  {records.length} record{records.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {records.map((record, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-800/20"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{record.record_type}</div>
                          <div className="text-xs text-neutral-400">
                            {new Date(record.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <User className="w-3 h-3 mr-1" />
                        {record.doctor_email.split("@")[0]}
                      </Badge>
                    </div>
                    <div className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {record.notes}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* No records message */}
      {!loading && !error && patientId && records.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="w-12 h-12 text-neutral-200 dark:text-neutral-700 mx-auto mb-3" />
              <div className="text-sm text-neutral-400 mb-4">
                No medical records found for this patient
              </div>
              <Button size="sm" onClick={() => setAddDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Record
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Record Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medical Record</DialogTitle>
            <DialogDescription>
              Add a new medical record for patient {patientId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Record Type</Label>
              <Input
                placeholder="e.g. Consultation, Lab Result, Prescription"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Enter detailed notes about this medical record..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
            </div>
            {addMessage && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  addMessage.includes("success")
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/40 text-red-600 dark:text-red-400"
                }`}
              >
                {addMessage}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} disabled={adding}>
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
