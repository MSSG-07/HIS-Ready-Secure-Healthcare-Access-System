from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
import os

app = FastAPI(title="Secure Healthcare Access")

# CORS configuration - supports both development and production
origins = [
    "http://localhost:3000",  # Local development
    "https://his-ready-secure-healthcare-access.vercel.app",  # Vercel production
    os.getenv("FRONTEND_URL", ""),  # Additional frontend URL from env
]

# Remove empty strings and trailing slashes
origins = [origin.rstrip("/") for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")

@app.get("/")
def root():
    return {"message": "Healthcare Secure API running"}