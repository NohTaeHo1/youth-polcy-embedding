# import requests
# import time
# import requests

# def summarize_with_ollama(prompt: str, model: str = "mistral", temperature: float = 0.7, max_tokens: int = 512) -> str:
#     try:
#         response = requests.post(
#             url="http://localhost:11434/api/generate",
#             json={
#                 "model": model,
#                 "prompt": prompt,
#                 "temperature": temperature,
#                 "max_tokens": max_tokens,
#                 "stream": False
#             },
#             timeout=600
#         )
#         response.raise_for_status()
#         result = response.json()
#         return result.get("response", "").strip()
#     except Exception as e:
#         print(f"[LLM Error] {e}")
#         return ""

# def wait_for_ollama_ready(timeout=180):
#     print("🟡 Ollama 준비 상태 확인 중...")
#     start = time.time()
#     while time.time() - start < timeout:
#         try:
#             r = requests.get("http://localhost:11434/api/tags", timeout=5)
#             if r.status_code == 200 and "models" in r.json() and r.json()["models"]:
#                 print("🟢 Ollama 준비 완료.")
#                 return True
#         except Exception as e:
#             print(f"예외 발생: {e}")
#         time.sleep(3)
#     raise RuntimeError("🔴 Ollama 서버가 준비되지 않았습니다.")


import asyncio
import requests
import json
import aiohttp
from app.config import API_URL,MODEL_NAME
from collections import defaultdict

class llm_utils:
    """
    LLM 유틸리티 클래스
    이 클래스는 LLM 요청을 처리하고 응답을 반환하는 기능을 제공
    속성:
    
    """
    def __init__(self):
        self.api_url = API_URL
        self.model = MODEL_NAME
        self.temperature = 0.2

    async def send_request(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "temperature": self.temperature,
        }
        # aiohttp ClientSession을 사용하여 비동기 HTTP 요청 수행
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(self.api_url, json=payload, timeout=15) as response:
                    response.raise_for_status()  # HTTP 에러 발생 시 예외 처리
                    full_response = await response.text()  # 응답을 비동기적으로 읽기
            except aiohttp.ClientError as e:
                print(f"HTTP 요청 실패: {e}")
                raise RuntimeError(f"Ollama API 요청 실패: {e}") from e

        # 전체 응답을 줄 단위로 분할하고 JSON 파싱
        lines = full_response.splitlines()
        all_text = ""
        for line in lines:
            try:
                json_line = json.loads(line.strip())
                all_text += json_line.get("response", "")
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                continue

        return all_text.strip() if all_text else "Empty response received"
