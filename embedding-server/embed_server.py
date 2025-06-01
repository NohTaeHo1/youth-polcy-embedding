from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List
import requests

app = FastAPI()
model = SentenceTransformer("BAAI/bge-m3")

def embed_texts(texts):
    url = "http://localhost:8000/embed"
    response = requests.post(url, json={"texts": texts})
    response.raise_for_status()
    return response.json()["embeddings"]

class TextListRequest(BaseModel):
    texts: List[str]

@app.post("/embed")
def embed_texts(req: TextListRequest):
    if not req.texts or not any(text.strip() for text in req.texts):
        raise HTTPException(status_code=400, detail="텍스트 리스트가 비어 있거나 유효하지 않음.")
    try:
        embeddings = model.encode(req.texts, show_progress_bar=False)
        return {"embeddings": embeddings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
