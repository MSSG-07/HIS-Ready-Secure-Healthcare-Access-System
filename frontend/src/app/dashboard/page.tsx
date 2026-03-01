"use client";

import { useAuth } from "@/lib/auth-context";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { DoctorDashboard } from "@/components/dashboards/doctor-dashboard";
import { PatientDashboard } from "@/components/dashboards/patient-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "patient":
      return <PatientDashboard />;
    default:
      return <PatientDashboard />;
  }
}
