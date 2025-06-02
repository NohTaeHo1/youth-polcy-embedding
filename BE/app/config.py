import os

MONGO_URI = os.getenv("MONGODB_URL")
ONTO_API_KEY = os.getenv("ONTO_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
<<<<<<< HEAD:app/config.py
PINECONE_ENVIRONMENT = 'us-east-1'
=======
>>>>>>> service:BE/app/config.py

if not MONGO_URI:
    raise ValueError("MONGODB_URL is not set in .env")
if not ONTO_API_KEY:
    raise ValueError("ONTO_API_KEY is not set in .env")
<<<<<<< HEAD:app/config.py
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set in .env")


=======

MODEL_NAME = "gemma-3-4b-it"
API_URL = "http://localhost:11434/api/generate"
>>>>>>> service:BE/app/config.py
