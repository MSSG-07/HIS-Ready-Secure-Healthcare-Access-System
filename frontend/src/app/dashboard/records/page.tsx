"use client";

import { useAuth } from "@/lib/auth-context";
import { PatientDashboard } from "@/components/dashboards/patient-dashboard";

export default function RecordsPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <PatientDashboard />;
}
