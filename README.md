# HIS-Ready Secure Healthcare Access System

A production-grade healthcare information security platform featuring role-based access control, break-glass emergency protocols, real-time anomaly detection, and full HIS integration -- built for the modern clinical workflow.

---

## Architecture

```
                    +──────────────────+
                    |   Next.js 16     |
                    |  Apple HIG UI    |
                    |  (React 19 + TS) |
                    +────────┬─────────+
                             |
                    REST / JWT Bearer
                             |
                    +────────┴─────────+
                    |    FastAPI       |
                    |  RBAC + Auth     |
                    +────────┬─────────+
                         ┌───┴───┐
                    +────┴──+ +──┴────+
                    |MongoDB| | HIS   |
                    | Users | |Adapter|
                    +───────+ +───────+
```

| Layer        | Technology                                           |
| ------------ | ---------------------------------------------------- |
| Frontend     | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4   |
| Components   | Radix UI primitives (shadcn pattern), Lucide icons    |
| Visualisation| Recharts, Framer Motion                              |
| Backend      | FastAPI, Pydantic                                    |
| Auth         | JWT (HS256, 30-min expiry), bcrypt (passlib)          |
| Database     | MongoDB (pymongo)                                    |
| HIS          | Pluggable adapter layer (mock included)               |

---

## Features

### Security & Access Control
- **Role-Based Access Control** -- Admin, Doctor, Patient roles with granular permissions
- **JWT Authentication** -- HS256 signed tokens with 30-minute expiry and auto-renewal awareness
- **Break-Glass Protocol** -- Emergency patient access with 72-hour audit window and admin review
- **Session Security Monitor** -- Real-time token countdown, browser fingerprint, security posture checks

### Clinical Workflow
- **Patient Lookup** -- Instant search by patient ID with quick-access shortcuts
- **Access Request Pipeline** -- Formal request/review/approve workflow between doctors and admins
- **Patient Records View** -- Self-service portal for patients to view their own data

### Operations & Intelligence
- **SOC Dashboard** -- Centralised security operations center with threat scoring and event feeds
- **AI Anomaly Detection** -- Simulated behavioral anomaly engine with severity classification
- **System Health Monitor** -- Infrastructure status for Auth, Database, HIS, Encryption, API, and Audit services
- **Live Vitals Monitor** -- Real-time patient vital signs (HR, SpO2, Temperature, Respiratory Rate) with sparkline trends

### Design
- **Apple HIG-inspired** -- Compact, refined layout with neutral colour palette
- **Glassmorphism** -- Backdrop-blur panels, subtle shadows, rounded-2xl cards
- **Responsive** -- Desktop-first with mobile bottom navigation bar
- **Dark mode ready** -- Full light/dark token support in CSS custom properties

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- MongoDB running on `localhost:27017`

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API starts at `http://localhost:8000`. Docs at `/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:3000`.

### 3. Create Users

Register via the UI (`/register`) or POST directly:

```bash
# Admin
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"Admin@123","role":"admin"}'

# Doctor
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"drsmith","password":"Doctor@123","role":"doctor"}'

# Patient
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"patient1","password":"Patient@123","role":"patient"}'
```

### 4. Test Flows

| Flow                  | Steps                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| Patient Lookup        | Login as doctor, search `P1001` or `P008`                             |
| Access Request        | Doctor submits request, admin reviews in Access Management            |
| Emergency Override    | Doctor triggers break-glass for any patient ID                        |
| SOC Monitoring        | Login as admin, view threat scores and audit events                   |
| Anomaly Detection     | Admin dashboard shows live anomaly feed                               |
| Vitals Monitor        | Doctor dashboard displays real-time simulated vitals                  |

---

## Project Structure

```
vit/
  backend/
    app/
      main.py           # FastAPI app, CORS, root endpoint
      config.py          # JWT secret, algorithm, expiry settings
      database.py        # MongoDB connection
      models/
        user_model.py    # Pydantic user schemas
      routes/
        auth_routes.py   # /api/auth/* endpoints
      services/
        his_adapter.py   # HIS integration layer
        mock_his.py      # Mock patient data provider
      utils/
        rbac.py          # Role-based access decorators
        security.py      # JWT create/verify, password hashing
  frontend/
    src/
      app/
        page.tsx                 # Landing page
        login/page.tsx           # Login
        register/page.tsx        # Registration with role select
        dashboard/
          layout.tsx             # Dashboard shell, role-based nav
          page.tsx               # Route to role-specific dashboard
          soc/page.tsx           # SOC Center (admin)
          access/page.tsx        # Access Management (admin)
          emergency/page.tsx     # Break-glass protocol (doctor)
          requests/page.tsx      # Access requests (doctor)
          patients/page.tsx      # Patient browser (admin/doctor)
          records/page.tsx       # Patient records (patient)
      components/
        dashboards/
          admin-dashboard.tsx    # Admin overview + innovative features
          doctor-dashboard.tsx   # Doctor portal + vitals + session security
          patient-dashboard.tsx  # Patient self-service
        features/
          anomaly-detection.tsx  # AI anomaly detection feed
          vitals-monitor.tsx     # Live patient vitals sparklines
          session-security.tsx   # Session security panel
          system-health.tsx      # Infrastructure health monitor
        ui/                      # Radix-based shadcn components
      lib/
        api.ts                   # Typed API client
        auth-context.tsx         # React auth context + provider
        utils.ts                 # cn() utility
```

---

## API Endpoints

| Method | Endpoint                    | Auth     | Description                          |
| ------ | --------------------------- | -------- | ------------------------------------ |
| POST   | `/api/auth/signup`          | Public   | Register new user                    |
| POST   | `/api/auth/login`           | Public   | Authenticate, returns JWT            |
| GET    | `/api/auth/me`              | Bearer   | Current user profile                 |
| GET    | `/api/auth/patient/{id}`    | Bearer   | Get patient record (RBAC enforced)   |
| POST   | `/api/auth/access-request`  | Bearer   | Doctor requests patient access       |
| POST   | `/api/auth/review-request`  | Bearer   | Admin approves/denies request        |
| GET    | `/api/auth/access-logs`     | Bearer   | Admin views access audit logs        |

Emergency access is triggered by sending `X-Emergency-Access: true` header with a patient GET request.

---

## Environment Variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend

```
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=<your-secret>
```

---

## Tech Stack

**Frontend:** Next.js 16.1.6 | React 19.2.3 | TypeScript 5 | Tailwind CSS 4 | Radix UI | Recharts | Framer Motion | Lucide React

**Backend:** FastAPI | Python 3.10+ | MongoDB | python-jose | passlib | bcrypt

---

## License

MIT
