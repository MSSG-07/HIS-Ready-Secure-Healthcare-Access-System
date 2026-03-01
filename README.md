# MedVault - HIS-Ready Secure Healthcare Access System

> **Enterprise-grade authentication and access control layer for Healthcare Information Systems with pluggable HIS integration**

[![Security](https://img.shields.io/badge/Security-RBAC%20%2B%20JWT-green)]()
[![Healthcare](https://img.shields.io/badge/Healthcare-HIS%20Ready-blue)]()
[![Integration](https://img.shields.io/badge/Integration-Adapter%20Pattern-orange)]()

MedVault is a production-ready security middleware designed to wrap existing Healthcare Information Systems (HIS) with modern authentication, fine-grained access control, and comprehensive audit logging. Built with a pluggable adapter architecture, it integrates seamlessly with your existing infrastructure without requiring changes to your core HIS.

---

## 🎯 Core Value Proposition

### For Healthcare Organizations
- **Zero HIS Modification**: Integrates via adapter pattern - your existing HIS remains untouched
- **Regulatory Compliance**: Built-in audit trails, access logging, and emergency access protocols
- **Instant RBAC**: Role-based access control out of the box
- **Break-Glass Protocol**: Compliant emergency access for life-critical situations with automatic flagging

### For IT Departments
- **Plug-and-Play**: Deploys as a microservice in front of your HIS
- **Modern Stack**: FastAPI backend + Next.js frontend with TypeScript
- **Stateless Auth**: JWT-based authentication for horizontal scalability
- **Real-time Monitoring**: SOC dashboard with threat detection and anomaly alerts

---

## 🔐 Security Architecture

### 1. **Multi-Layer Authentication**

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: JWT Authentication (HS256)               │
│  • 30-minute token expiry with automatic session   │
│  • Secure httpOnly cookies (production mode)       │
│  • Device fingerprinting & browser validation      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: Role-Based Access Control (RBAC)         │
│  • Admin: Full system oversight + SOC access       │
│  • Doctor: Patient records + access requests       │
│  • Patient: Own records only (self-service)        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: Resource-Level Authorization             │
│  • Doctor-patient assignment validation            │
│  • HIS adapter enforcement @ data layer            │
│  • Automatic audit log on every access attempt     │
└─────────────────────────────────────────────────────┘
```

**Implementation:**
- **Password Security**: bcrypt hashing with configurable work factor (default: 12 rounds)
- **Token Security**: HS256 JWT with configurable secret rotation
- **Session Security**: Automatic timeout tracking with visual indicators
- **CORS Protection**: Whitelist-based origin validation

---

### 2. **Break-Glass Emergency Access Protocol**

Critical care situations often require immediate access to patient records. MedVault implements a compliant break-glass protocol:

```python
# Emergency access workflow
POST /api/auth/patients/{patient_id}
Headers: X-Emergency-Access: true

Response:
{
  "access_granted": true,
  "audit_trail_id": "bg_12345",
  "expires_in": "72h",
  "review_required": true
}
```

**Security Guarantees:**
- ✅ Immediate access granted (no blocking)
- ✅ Event logged with HIGH RISK flag
- ✅ 72-hour automatic expiry window
- ✅ Mandatory admin review queue
- ✅ Full audit trail with timestamp + reason

**Compliance Features:**
- HIPAA-compliant audit logging
- Automatic flagging for retrospective review
- Non-repudiation (signed access logs)
- Configurable approval workflow

---

### 3. **Role-Based Access Control (RBAC)**

#### Permission Matrix

| Resource                | Admin | Doctor | Patient |
|------------------------|-------|--------|---------|
| View own records       | ✓     | ✓      | ✓       |
| View assigned patients | ✓     | ✓      | ✗       |
| View all patients      | ✓     | ✗      | ✗       |
| Request access         | ✗     | ✓      | ✗       |
| Grant/deny access      | ✓     | ✗      | ✗       |
| Break-glass access     | ✓     | ✓      | ✗       |
| Add medical records    | ✗     | ✓      | ✗       |
| SOC dashboard          | ✓     | ✗      | ✗       |
| Audit logs             | ✓     | ✗      | ✗       |
| System health          | ✓     | ✗      | ✗       |

#### Access Request Workflow

```
Doctor                    Admin                     HIS
  │                         │                        │
  ├─► Request Access        │                        │
  │   (patient_id + reason) │                        │
  │                         │                        │
  │                    ◄────┤ Review Request         │
  │                         ├─► Approve/Reject       │
  │                         │                        │
  │◄──── Access Granted ────┤                        │
  │                         │                        │
  ├─────────────────────────┴───► Query HIS ────────►│
  │                                                   │
  │◄──────────────────────────── Patient Data ───────┤
```

---

## 🏗️ HIS Integration Architecture

### Adapter Pattern Implementation

The system uses a **pluggable adapter layer** to integrate with any existing HIS without modifying your core infrastructure.

```
┌──────────────────────────────────────────────────────────┐
│  MedVault API Layer                                      │
│  ├── Authentication & Authorization                      │
│  ├── Access Control & Audit Logging                     │
│  └── Break-Glass Protocol                               │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  HIS Adapter Interface (Pluggable)                       │
│                                                           │
│  class HISAdapter:                                       │
│    def get_patient(patient_id: str) -> Patient          │
│    def search_patients(query: str) -> List[Patient]     │
│    def get_patient_history(patient_id: str) -> History  │
│    def add_medical_record(record: Record) -> bool       │
└─────────────────────┬────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Your HIS       │     │  Mock HIS       │
│  (Real Data)    │     │  (Development)  │
│                 │     │                 │
│  • REST API     │     │  • In-memory    │
│  • SOAP         │     │  • Test data    │
│  • HL7 FHIR     │     │  • Validation   │
│  • Database     │     └─────────────────┘
└─────────────────┘
```

### Integration Options

#### Option 1: REST API Integration
```python
# backend/app/services/his_adapter.py
class HISAdapter:
    def __init__(self):
        self.his_base_url = os.getenv("HIS_API_URL")
        self.api_key = os.getenv("HIS_API_KEY")
    
    def get_patient(self, patient_id: str) -> dict:
        response = requests.get(
            f"{self.his_base_url}/patients/{patient_id}",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        return response.json()
```

#### Option 2: Database Direct Access
```python
class HISAdapter:
    def __init__(self):
        self.his_db = create_engine(os.getenv("HIS_DB_CONNECTION"))
    
    def get_patient(self, patient_id: str) -> dict:
        with self.his_db.connect() as conn:
            result = conn.execute(
                "SELECT * FROM patients WHERE id = %s", 
                (patient_id,)
            )
            return dict(result.fetchone())
```

#### Option 3: HL7 FHIR Integration
```python
from fhirclient import client

class HISAdapter:
    def __init__(self):
        self.fhir_client = client.FHIRClient(settings={
            'app_id': 'medvault',
            'api_base': os.getenv("FHIR_SERVER_URL")
        })
    
    def get_patient(self, patient_id: str) -> dict:
        from fhirclient.models.patient import Patient
        patient = Patient.read(patient_id, self.fhir_client.server)
        return patient.as_json()
```

---

## 🚀 Deployment Guide

### Prerequisites
- **Backend**: Python 3.10+, MongoDB 4.4+
- **Frontend**: Node.js 18+, npm 9+
- **Infrastructure**: Docker (optional), Nginx (production)

### Quick Start (Development)

```bash
# 1. Clone and prepare
git clone <repository>
cd vit

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure environment
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=$(openssl rand -hex 32)
HIS_API_URL=https://your-his-api.com  # Your HIS endpoint
HIS_API_KEY=your_api_key_here
EOF

# 4. Start backend
uvicorn app.main:app --reload --port 8000

# 5. Frontend setup (new terminal)
cd ../frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Access at: http://localhost:3000

---

### Production Deployment

#### 1. Backend (Systemd Service)

```bash
# /etc/systemd/system/medvault-api.service
[Unit]
Description=MedVault API
After=network.target mongodb.service

[Service]
Type=simple
User=medvault
WorkingDirectory=/opt/medvault/backend
Environment="PATH=/opt/medvault/venv/bin"
ExecStart=/opt/medvault/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

#### 2. Frontend (Next.js Production Build)

```bash
cd frontend
npm run build
npm start  # Runs on port 3000
```

#### 3. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/medvault
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 443 ssl http2;
    server_name medvault.yourhospital.com;
    
    ssl_certificate /etc/ssl/certs/medvault.crt;
    ssl_certificate_key /etc/ssl/private/medvault.key;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

#### 4. Docker Compose (Optional)

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      MONGO_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017
      JWT_SECRET: ${JWT_SECRET}
      HIS_API_URL: ${HIS_API_URL}
    depends_on:
      - mongodb
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8000

volumes:
  mongo_data:
```

---

## 🔌 HIS Adapter Implementation Guide

### Step 1: Implement the Adapter Interface

Create your custom adapter in `backend/app/services/his_adapter.py`:

```python
from typing import Optional, List, Dict
import os

class HISAdapter:
    """
    Adapter interface for HIS integration.
    Implement these methods to connect to your existing HIS.
    """
    
    def __init__(self):
        # Initialize your HIS connection
        self.his_endpoint = os.getenv("HIS_API_URL")
        self.credentials = {
            "api_key": os.getenv("HIS_API_KEY"),
            "username": os.getenv("HIS_USERNAME"),
            "password": os.getenv("HIS_PASSWORD")
        }
        # Add authentication, connection pooling, etc.
    
    def get_patient(self, patient_id: str) -> Optional[Dict]:
        """
        Fetch patient record from HIS.
        
        Args:
            patient_id: Unique patient identifier
            
        Returns:
            {
                "patient_id": str,
                "name": str,
                "age": int,
                "condition": str,
                "admission_date": str,  # ISO format
                "medical_history": List[str],
                "allergies": List[str],
                "medications": List[Dict]
            }
        """
        # Your HIS integration logic here
        raise NotImplementedError("Implement your HIS patient fetch")
    
    def search_patients(self, query: str, limit: int = 10) -> List[Dict]:
        """Search patients by name, ID, or other criteria"""
        raise NotImplementedError()
    
    def get_patient_vitals(self, patient_id: str) -> Dict:
        """Fetch real-time patient vitals"""
        raise NotImplementedError()
    
    def get_medical_history(self, patient_id: str) -> List[Dict]:
        """Fetch complete medical history"""
        raise NotImplementedError()
    
    def add_observation(self, patient_id: str, observation: Dict) -> bool:
        """Add clinical observation"""
        raise NotImplementedError()

# Optional: Add caching layer
from functools import lru_cache
from datetime import timedelta

class CachedHISAdapter(HISAdapter):
    @lru_cache(maxsize=1000)
    def get_patient(self, patient_id: str) -> Optional[Dict]:
        return super().get_patient(patient_id)
```

### Step 2: Configure Environment Variables

```bash
# .env
HIS_API_URL=https://his.yourhospital.com/api/v1
HIS_API_KEY=your_secure_api_key
HIS_USERNAME=medvault_service
HIS_PASSWORD=secure_password

# For HL7 FHIR
FHIR_SERVER_URL=https://fhir.yourhospital.com/r4

# For database access
HIS_DB_CONNECTION=postgresql://user:pass@his-db:5432/hospital
```

### Step 3: Test Your Adapter

```python
# test_his_adapter.py
from app.services.his_adapter import HISAdapter

def test_adapter():
    adapter = HISAdapter()
    
    # Test patient fetch
    patient = adapter.get_patient("P1001")
    assert patient is not None
    assert "patient_id" in patient
    assert "name" in patient
    
    print("✓ HIS Adapter working correctly")

if __name__ == "__main__":
    test_adapter()
```

---

## 📊 Monitoring & Observability

### Built-in SOC Dashboard

Access real-time security operations at `/dashboard/soc`:

- **Threat Score**: Dynamic calculation based on high-risk events
- **Event Timeline**: Real-time access log stream
- **Anomaly Detection**: AI-powered behavioral analysis
- **System Health**: Infrastructure service monitoring

### Audit Trail Schema

Every access is logged immutably:

```json
{
  "user_email": "doctor@hospital.com",
  "patient_id": "P1001",
  "access_type": "normal_access | break_glass | access_request",
  "reason": "Clinical consultation",
  "timestamp": "2026-03-02T10:30:00Z",
  "status": "approved | pending | rejected",
  "risk_level": "normal | high",
  "alert_flag": false,
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "session_id": "sess_abc123"
}
```

### Key Metrics

```python
# Available via /api/auth/admin/access-logs
{
  "soc_summary": {
    "total_events": 1523,
    "high_risk_events": 12,
    "pending_reviews": 3,
    "approved_events": 1508,
    "high_risk_pending": 2  # Requires immediate attention
  }
}
```

---

## 🛡️ Security Best Practices

### 1. JWT Secret Rotation
```bash
# Generate strong secret
openssl rand -hex 32

# Rotate regularly (recommended: every 90 days)
# Update .env and restart services
JWT_SECRET=new_secret_here
```

### 2. Database Security
```javascript
// MongoDB user with minimum privileges
use secure_healthcare
db.createUser({
  user: "medvault_app",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "secure_healthcare" }
  ]
})
```

### 3. Rate Limiting
```python
# Add to main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/auth/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
def login(user: UserLogin):
    ...
```

### 4. HTTPS Enforcement
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name medvault.yourhospital.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📈 Scaling Considerations

### Horizontal Scaling

MedVault is **stateless** and ready for horizontal scaling:

```bash
# Multiple backend instances behind load balancer
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000  # Instance 1
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8001  # Instance 2
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8002  # Instance 3
```

### Database Optimization

```javascript
// Recommended indexes for MongoDB
db.users.createIndex({ "email": 1 }, { unique: true })
db.access_logs.createIndex({ "timestamp": -1 })
db.access_logs.createIndex({ "user_email": 1, "patient_id": 1 })
db.access_requests.createIndex({ "status": 1, "requested_at": -1 })
```

### Caching Strategy

```python
# Add Redis for session caching
import redis
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_patient_data(ttl=300):  # 5 minutes
    def decorator(func):
        @wraps(func)
        def wrapper(patient_id: str):
            cache_key = f"patient:{patient_id}"
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            result = func(patient_id)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:e2e  # Playwright E2E tests
```

### Security Testing
```bash
# SQL injection, XSS, CSRF checks
npm install -g @owasp/dependency-check
dependency-check --project MedVault --scan ./backend ./frontend
```

---

## 📦 Tech Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Frontend       | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| UI Components  | Radix UI (shadcn pattern), Framer Motion           |
| Backend        | FastAPI, Pydantic                                   |
| Authentication | JWT (python-jose HS256), bcrypt (passlib)          |
| Database       | MongoDB 6.0+ (pymongo)                              |
| Monitoring     | SOC Dashboard, Recharts visualization               |
| HIS Integration| Pluggable adapter (REST/FHIR/DB)                    |

---

## 🤝 Contributing

We welcome contributions! Areas of focus:
- Additional HIS adapter implementations (EPIC, Cerner, Allscripts)
- Enhanced security features (2FA, biometric auth)
- Performance optimizations
- Compliance certifications (HIPAA, GDPR)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🆘 Support

- **Documentation**: Full API docs at `/docs` (Swagger UI)
- **Issues**: GitHub Issues for bug reports
- **Security**: Report vulnerabilities to security@medvault.com

---

## 🎯 Roadmap

- [ ] SAML 2.0 SSO integration
- [ ] HL7 v2.x message parsing
- [ ] Multi-tenant support
- [ ] Mobile app (React Native)
- [ ] Advanced ML-based anomaly detection
- [ ] Blockchain audit trail (immutable logging)
- [ ] FHIR R4 full compliance

---

**Built for healthcare, tested for security, ready for production.**
