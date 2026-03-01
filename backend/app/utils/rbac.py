from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_access_token
from app.database import users_collection
from app.utils.security import get_current_user
from fastapi import Request
from datetime import datetime, timedelta
from app.database import access_logs_collection
from app.database import access_requests_collection


security = HTTPBearer()

# 🔐 Get current logged-in user
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    payload = decode_access_token(token)

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user

# 🛂 Role checker dependency
def require_role(required_role: str):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"{required_role} access required",
            )
        return current_user

    return role_checker


# 🔍 check latest break-glass record
def get_active_emergency_access(user_email: str, patient_id: str):
    log = access_logs_collection.find_one(
        {
            "user_email": user_email,
            "patient_id": patient_id,
            "access_type": "break_glass",
        },
        sort=[("timestamp", -1)],
    )

    if not log:
        return None

    now = datetime.utcnow()

    # ✅ approved → always valid
    if log.get("approved") is True:
        return log

    # ✅ within 72 hours → temporary valid
    if now < log.get("expires_at"):
        return log

    # ❌ expired → revoke
    return None

# 🏥 Patient access guard
def require_patient_access():
    def checker(
        request: Request,
        patient_id: str,
        current_user: dict = Depends(get_current_user),
    ):
        # ✅ admin override
        if current_user["role"] == "admin":
            return current_user

        assigned = current_user.get("assigned_patients", [])

        # ✅ NORMAL ACCESS
        if patient_id in assigned:
            return current_user
        approved_request = access_requests_collection.find_one({
            "user_email": current_user["email"],
            "patient_id": patient_id,
            "status": "approved",
        })

        if approved_request:
            return current_user

        # 🧨 CHECK EXISTING EMERGENCY ACCESS (NEW)
        emergency_record = access_logs_collection.find_one(
            {
                "user_email": current_user["email"],
                "patient_id": patient_id,
                "access_type": "break_glass",
            },
            sort=[("timestamp", -1)],
        )

        if emergency_record:
            now = datetime.utcnow()

            # ✅ approved → always allow
            if emergency_record.get("approved") is True:
                return current_user

            # ✅ within 72 hours → temporary allow
            if now < emergency_record.get("expires_at"):
                return current_user
            # else expired → fall through to deny

        # 🚨 BREAK-GLASS TRIGGER (NEW REQUEST)
        emergency = request.headers.get("X-Emergency-Access")

        if current_user["role"] == "doctor" and emergency == "true":
            access_logs_collection.insert_one({
                "user_email": current_user["email"],
                "patient_id": patient_id,
                "access_type": "break_glass",
                "reason": "Emergency access",
                "timestamp": datetime.utcnow(),
                # ✅ FIXED → 72 hours
                "expires_at": datetime.utcnow() + timedelta(hours=72),
                "approved": False,
                "status": "pending",  # ✅ NEW
                "risk_level": "high",
                "alert_flag": True,
            })
            return current_user

        # ❌ deny
        raise HTTPException(
            status_code=403,
            detail="Access denied: patient not assigned",
        )

    return checker