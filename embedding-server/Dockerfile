FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install fastapi uvicorn sentence-transformers

CMD ["uvicorn", "embed_server:app", "--host", "0.0.0.0", "--port", "8000"]
