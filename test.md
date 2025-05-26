docker exec -it ollama ollama rm mistral
docker exec -it ollama ollama pull mistral:instruct-q4_K_M

response = requests.post(
    url="http://localhost:11434/api/generate",
    json={
        "model": "mistral:instruct-q4_K_M",  # ← 경량 버전 지정
        "prompt": prompt,
        "stream": False
    },
    timeout=120
)

test
curl http://localhost:11434/api/tags
