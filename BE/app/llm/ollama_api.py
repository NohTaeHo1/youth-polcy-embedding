import requests
import json

class OllamaChatClient:
    def __init__(self, api_url='http://localhost:11434/api/chat'):
        self.api_url = api_url
        self.model = 'gemma3:1b'
        
    async def send_request(self, messages: list) -> str:
        """
        공통 요청 처리 함수: /chat API 호출 및 응답 처리
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "stream" : False
        }

        try:
            response = requests.post(self.api_url, json=payload)
            response.raise_for_status()  # HTTP 에러 발생 시 예외 처리

            response_json = response.json()
            print(f"response_json : {response_json}")
            assistant_reply = response_json.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            return assistant_reply.strip() if assistant_reply else "Empty response received"

        except requests.exceptions.RequestException as e:
            print(f"HTTP 요청 실패: {e}")
            raise RuntimeError(f"Ollama API 요청 실패: {e}")
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return "Invalid JSON response received"
        

   