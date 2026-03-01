import os
from dotenv import load_dotenv

load_dotenv()  # loads from project root

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

if not JWT_SECRET:
    raise ValueError("JWT_SECRET is not set in environment variables")

ACCESS_TOKEN_EXPIRE_MINUTES = 30