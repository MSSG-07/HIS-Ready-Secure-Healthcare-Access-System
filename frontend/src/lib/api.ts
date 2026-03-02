const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://medvault-api-dogy.onrender.com";

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

export async function api<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, token, headers: extraHeaders } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(res.status, err.detail || "Request failed");
  }

  return res.json();
}

// --- Auth ---
export const authApi = {
  login: (email: string, password: string) =>
    api<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  signup: (email: string, password: string, role: string, patient_id?: string) =>
    api<{ message: string }>("/api/auth/signup", {
      method: "POST",
      body: { email, password, role, patient_id },
    }),

  me: (token: string) =>
    api<{ email: string; role: string }>("/api/auth/me", { token }),
};

// --- Patients ---
export const patientApi = {
  get: (patientId: string, token: string, emergency = false) =>
    api<{
      message: string;
      user: string;
      patient: {
        patient_id: string;
        name: string;
        age: number;
        condition: string;
      } | null;
    }>(`/api/auth/patients/${patientId}`, {
      token,
      headers: emergency ? { "X-Emergency-Access": "true" } : {},
    }),
};

// --- Access Requests ---
export const accessApi = {
  requestAccess: (patientId: string, reason: string, token: string) =>
    api<{ message: string }>(`/api/auth/doctor/request-access?patient_id=${patientId}&reason=${encodeURIComponent(reason)}`, {
      method: "POST",
      token,
    }),

  reviewRequest: (patientId: string, userEmail: string, approve: boolean, token: string) =>
    api<{ message: string }>(
      `/api/auth/admin/review-request/${patientId}/${userEmail}?approve=${approve}`,
      { method: "POST", token }
    ),

  addMedicalRecord: (patientId: string, recordType: string, notes: string, token: string) =>
    api<{ message: string }>(
      `/api/auth/doctor/add-medical-record?patient_id=${patientId}&record_type=${encodeURIComponent(recordType)}&notes=${encodeURIComponent(notes)}`,
      { method: "POST", token }
    ),

  getMedicalRecords: (patientId: string, token: string) =>
    api<{
      records: Array<{
        patient_id: string;
        doctor_email: string;
        record_type: string;
        notes: string;
        created_at: string;
      }>;
    }>(`/api/auth/medical-records/${patientId}`, { token }),
};

// --- Admin ---
export const adminApi = {
  getAccessLogs: (token: string) =>
    api<{
      soc_summary: {
        total_events: number;
        high_risk_events: number;
        pending_reviews: number;
        approved_events: number;
        high_risk_pending: number;
      };
      recent_events: Array<{
        user_email: string;
        patient_id: string;
        access_type: string;
        reason: string;
        timestamp: string;
        status: string;
        risk_level: string;
        alert_flag: boolean;
      }>;
    }>("/api/auth/admin/access-logs", { token }),

  getAccessRequests: (token: string) =>
    api<{
      summary: {
        total_requests: number;
        pending: number;
        approved: number;
        rejected: number;
      };
      requests: Array<{
        user_email: string;
        patient_id: string;
        reason: string;
        status: string;
        requested_at: string;
        reviewed_by?: string;
        reviewed_at?: string;
      }>;
    }>("/api/auth/admin/access-requests", { token }),
};
