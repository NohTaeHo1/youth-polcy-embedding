import requests
import time
import requests

def summarize_with_ollama(prompt: str, model: str = "mistral", temperature: float = 0.7, max_tokens: int = 512) -> str:
    try:
        response = requests.post(
            url="http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False
            },
            timeout=600
        )
        response.raise_for_status()
        result = response.json()
        return result.get("response", "").strip()
    except Exception as e:
        print(f"[LLM Error] {e}")
        return ""

def wait_for_ollama_ready(timeout=180):
    print("🟡 Ollama 준비 상태 확인 중...")
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get("http://localhost:11434/api/tags", timeout=5)
            if r.status_code == 200 and "models" in r.json() and r.json()["models"]:
                print("🟢 Ollama 준비 완료.")
                return True
        except Exception as e:
            print(f"예외 발생: {e}")
        time.sleep(3)
    raise RuntimeError("🔴 Ollama 서버가 준비되지 않았습니다.")
