from pymongo import MongoClient
from app.config import MONGO_URI

# Create Mongo client
client = MongoClient(MONGO_URI)

# Database
db = client["secure_healthcare"]

# Collections
users_collection = db["users"]
security_events_collection = db["security_events"]
access_logs_collection = db["access_logs"]  # For logging access to patient records
access_requests_collection = db["access_requests"]
medical_records_collection = db["medical_records"]  # Medical records added by doctors