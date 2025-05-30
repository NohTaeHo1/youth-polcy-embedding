import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URL")
ONTO_API_KEY = os.getenv("ONTO_API_KEY")

if not MONGO_URI:
    raise ValueError("MONGODB_URL is not set in .env")
if not ONTO_API_KEY:
    raise ValueError("ONTO_API_KEY is not set in .env")
