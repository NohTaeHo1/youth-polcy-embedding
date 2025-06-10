from app.database.mongodb import get_mongo_client
from app.llm.llm_promptHandler import promptHandler
import requests

class RAG:
    def __init__(self,
                 db_name="youth_policies",
                 collection_name="processed_policies",
                 ollama_url="http://ollama:11434/api/generate",
                 model_name="gemma-3-4b-it"):
        
        self.db_name = db_name
        self.collection_name = collection_name
        self.ollama_url = ollama_url
        self.model_name = model_name
        self.prompt_handler = promptHandler()

    def get_policy_context(self, query, top_k=3):
        """
        MongoDB에서 정책 데이터를 불러와 간단한 텍스트 검색으로 top_k 반환
        """
        client = get_mongo_client()
        collection = client[self.db_name][self.collection_name]
        docs = list(collection.find({"$text": {"$search": query}}).limit(top_k))
        if not docs:
            docs = list(collection.find().limit(top_k))
        context = "\n\n".join([f"제목: {doc.get('title', '')}\n내용: {doc.get('content', '')}" for doc in docs])
        return context

    def ask_ollama(self, query, context):
        """
        Ollama LLM에 프롬프트 전달
        """
        
        payload = {
            "model": self.model_name,
            "prompt": self.prompt_handler.rag_prompt(context, query),
            "stream": False
        }
        response = requests.post(self.ollama_url, json=payload, timeout=60)
        response.raise_for_status()
        return response.json().get("response", "")

    def run(self, query):
        context = self.get_policy_context(query)
        answer = self.ask_ollama(query, context)
        return {"answer": answer, "context": context}