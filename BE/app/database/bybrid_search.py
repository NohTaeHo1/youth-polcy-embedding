from typing import List, Optional, Dict
import os
from pinecone import Pinecone
from app.database.mongodb import get_mongo_client
from app.llm.llm_embed import SentenceTransformerEmbedder
class HybridSearcher:
    def __init__(self):
        self.pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        self.index = self.pc.Index('youth-policies-index')
        self.mongo_client = get_mongo_client()
        self.policy_collection = self.mongo_client["youth_policies"]["origin_db"]
        self.embedder = SentenceTransformerEmbedder(model_name="BAAI/bge-m3")  # 변경

    def filter_by_conditions(self,
                           min_age: Optional[int] = None,
                           max_age: Optional[int] = None,
                           region: Optional[str] = None,
                           category: Optional[str] = None) -> List[str]:
        """MongoDB에서 조건에 맞는 정책 ID 목록 반환"""
        query = {}
        if min_age is not None:
            query["sprtTrgtMinAge"] = {"$lte": str(min_age)}
        if max_age is not None:
            query["sprtTrgtMaxAge"] = {"$gte": str(max_age)}
        if region:
            query["rgtrInstCdNm"] = {"$regex": region}
        if category is not None:
            query["$or"] = [
                {"lclsfNm": {"$regex": category}},
                {"mclsfNm": {"$regex": category}},
                {"plcyKywdNm": {"$regex": category}}
            ]
        policy_ids = [
            doc["plcyNo"] for doc in 
            self.policy_collection.find(query, {"plcyNo": 1})
        ]
        return policy_ids

    def semantic_search(self, query: str, policy_ids: List[str], top_k: int = 3):
        """Pinecone에서 특정 ID 목록 내에서 의미적 검색 수행"""
        query_embedding = self.embedder.get_embedding(query)  # 이제 벡터 리스트 반환
        
        # policy_ids가 비어있으면 빈 결과 반환
        if not policy_ids:
            return {"matches": []}
            
        results = self.index.query(
            vector=query_embedding,  # 이미 리스트 형태
            filter={"id": {"$in": policy_ids}},
            top_k=top_k,
            include_metadata=True
        )
        return results

    def hybrid_search(self,
                     query: str,
                     min_age: Optional[int] = None,
                     max_age: Optional[int] = None,
                     region: Optional[str] = None,
                     category: Optional[str] = None,
                     top_k: int = 3):
        """하이브리드 검색 수행"""
        filtered_ids = self.filter_by_conditions(
            min_age=min_age,
            max_age=max_age,
            region=region,
            category=category
        )
        if not filtered_ids:
            return {"message": "조건에 맞는 정책이 없습니다."}
        semantic_results = self.semantic_search(query, filtered_ids, top_k)
        results = []
        for match in semantic_results.matches:
            policy_detail = self.policy_collection.find_one(
                {"plcyNo": match.id}
            )
            if policy_detail:
                results.append({
                    "id": match.id,
                    "similarity": match.score,
                    "title": policy_detail.get("plcyNm"),
                    "description": policy_detail.get("plcyExplnCn"),
                    "category": policy_detail.get("lclsfNm"),
                    "target_age": f"{policy_detail.get('sprtTrgtMinAge')}~{policy_detail.get('sprtTrgtMaxAge')}",
                    "organization": policy_detail.get("rgtrInstCdNm"),
                    "support_content": policy_detail.get("plcySprtCn")
                })
        return results