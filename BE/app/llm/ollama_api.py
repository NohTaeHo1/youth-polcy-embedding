import requests
import json

class OllamaChatClient:
    def __init__(self, api_url='http://ollama:11434/api/generate'):
        self.api_url = api_url
        self.model = 'gemma3:1b'
        
    def send_request(self, prompt: str) -> dict:
        # prompt = messages[0]["content"] if messages and "content" in messages[0] else ""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        print(f"payload : {payload}")
        try:
            response = requests.post(self.api_url, json=payload, timeout=420)
            response.raise_for_status()
            response_json = response.json()
            print(f"response_json : {response_json}")
            assistant_reply = response_json.get("response", "")
            return {"result": assistant_reply.strip()} if assistant_reply else {"error": "Empty response received"}
        except requests.HTTPError as e:
            print(f"Ollama 응답 에러: {response.text}")
            raise RuntimeError(f"Ollama API 요청 실패: {e}")
        except requests.RequestException as e:
            print(f"HTTP 요청 실패: {e}")
            raise RuntimeError(f"Ollama API 요청 실패: {e}")
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return {"error": "Invalid JSON response received"}