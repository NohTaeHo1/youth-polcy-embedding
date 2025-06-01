from typing import List, Optional, Dict
import os
from pinecone import Pinecone
from app.database.mongodb import get_mongo_client

class HybridSearcher:
    def __init__(self):
        self.pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        self.index = self.pc.Index('youth-policies-index')
        self.mongo_client = get_mongo_client()
        self.policy_collection = self.mongo_client["youth_policies"]["origin_db"]

    def filter_by_conditions(self,
                           min_age: Optional[int] = None,
                           max_age: Optional[int] = None,
                           region: Optional[str] = None,
                           category: Optional[str] = None) -> List[str]:
        """MongoDB에서 조건에 맞는 정책 ID 목록 반환"""
        
        # 쿼리 조건 구성
        query = {}
        
        # 1. 나이 조건
        if min_age is not None:
            query["sprtTrgtMinAge"] = {"$lte": str(min_age)}
        if max_age is not None:
            query["sprtTrgtMaxAge"] = {"$gte": str(max_age)}
            
        # 2. 지역 조건
        if region:
            query["rgtrInstCdNm"] = {"$regex": region}
            
        # 3. 카테고리 조건 (예: 취업, 구직, 학생 등)
        if category:
            query["$or"] = [
                {"lclsfNm": {"$regex": category}},
                {"mclsfNm": {"$regex": category}},
                {"plcyKywdNm": {"$regex": category}}
            ]
        
        # MongoDB에서 조건에 맞는 정책 ID 추출
        policy_ids = [
            doc["plcyNo"] for doc in 
            self.policy_collection.find(query, {"plcyNo": 1})
        ]
        
        return policy_ids

    def semantic_search(self, query: str, policy_ids: List[str], top_k: int = 3):
        """Pinecone에서 특정 ID 목록 내에서 의미적 검색 수행"""
        
        query_embedding = self.get_embedding(query)  # 실제 임베딩 함수 구현 필요
        
        # Pinecone에서 필터링된 ID 내에서만 검색
        results = self.index.query(
            vector=query_embedding,
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
        
        # 1. MongoDB 조건 필터링
        filtered_ids = self.filter_by_conditions(
            min_age=min_age,
            max_age=max_age,
            region=region,
            category=category
        )
        
        if not filtered_ids:
            return {"message": "조건에 맞는 정책이 없습니다."}
            
        # 2. Pinecone 의미 검색
        semantic_results = self.semantic_search(query, filtered_ids, top_k)
        
        # 3. 결과 데이터 구성
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