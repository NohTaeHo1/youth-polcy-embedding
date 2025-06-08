from typing import List, Optional, Dict
import os
from pinecone import Pinecone
from app.database.mongodb import get_mongo_client
from app.llm.llm_embed import SentenceTransformerEmbedder
from bson import ObjectId

class HybridSearcher:
    def __init__(self):
        self.pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        self.index = self.pc.Index('youth-policies-index')
        self.mongo_client = get_mongo_client()
        self.policy_collection = self.mongo_client["youth_policies"]["detail_db"]
        self.embedder = SentenceTransformerEmbedder('BAAI/bge-m3')

    def filter_by_conditions(self,
                            min_age: Optional[int] = None,
                            max_age: Optional[int] = None,
                            region: Optional[str] = None,
                            category: Optional[str] = None) -> List[str]:
        """나이 > 지역 > 카테고리 우선순위로 정책 필터링"""
        
        def get_policy_ids(match_query):
            pipeline = [{"$match": match_query}] if match_query else []
            return [doc["plcyNo"] for doc in self.policy_collection.aggregate(pipeline)]

        # 나이 조건
        age_query = {}
        if min_age is not None:
            age_query["sprtTrgtMinAge"] = {"$lte": str(min_age)}
        if max_age is not None:
            age_query["sprtTrgtMaxAge"] = {"$gte": str(max_age)}

        # 지역 조건
        region_query = {
            "$or": [
                {"rgtrInstCdNm": {"$regex": region, "$options": "i"}},
                {"sprvsnInstCdNm": {"$regex": region, "$options": "i"}},
                {"rgtrUpInstCdNm": {"$regex": region, "$options": "i"}},
                {"rgtrHghrkInstCdNm": {"$regex": region, "$options": "i"}}
            ]
        } if region else {}

        # 카테고리 조건
        category_query = {
            "$or": [
                {"lclsfNm": {"$regex": category, "$options": "i"}},
                {"mclsfNm": {"$regex": category, "$options": "i"}}
            ]
        } if category else {}

        # 우선순위에 따라 조건 조합 체크
        # 1. 나이 포함 조건 (나이, 나이+지역, 나이+카테고리, 나이+지역+카테고리)
        if age_query:
            # 나이 + 지역 + 카테고리
            if region_query and category_query:
                combined_query = {**age_query, **region_query, **category_query}
                policy_ids = get_policy_ids(combined_query)
                if policy_ids:
                    print(f"Found {len(policy_ids)} policies matching age + region + category")
                    return policy_ids

            # 나이 + 지역
            if region_query:
                combined_query = {**age_query, **region_query}
                policy_ids = get_policy_ids(combined_query)
                if policy_ids:
                    print(f"Found {len(policy_ids)} policies matching age + region")
                    return policy_ids

            # 나이 + 카테고리
            if category_query:
                combined_query = {**age_query, **category_query}
                policy_ids = get_policy_ids(combined_query)
                if policy_ids:
                    print(f"Found {len(policy_ids)} policies matching age + category")
                    return policy_ids

            # 나이만
            combined_query = age_query
            policy_ids = get_policy_ids(combined_query)
            if policy_ids:
                print(f"Found {len(policy_ids)} policies matching age")
                return policy_ids

        # 2. 지역 포함 조건 (지역, 지역+카테고리)
        if region_query:
            # 지역 + 카테고리
            if category_query:
                combined_query = {**region_query, **category_query}
                policy_ids = get_policy_ids(combined_query)
                if policy_ids:
                    print(f"Found {len(policy_ids)} policies matching region + category")
                    return policy_ids

            # 지역만
            combined_query = region_query
            policy_ids = get_policy_ids(combined_query)
            if policy_ids:
                print(f"Found {len(policy_ids)} policies matching region")
                return policy_ids

        # 3. 카테고리만
        if category_query:
            combined_query = category_query
            policy_ids = get_policy_ids(combined_query)
            if policy_ids:
                print(f"Found {len(policy_ids)} policies matching category")
                return policy_ids

        print("No policies found matching any conditions")
        return []  # 아무 조건도 만족하지 않음
    
    def semantic_search(self, query: str, policy_ids: Optional[List[str]] = None, top_k: int = 3, similarity_threshold: float = 0.3) -> Dict:
        """Pinecone에서 쿼리로 가장 유사한 정책 검색"""
        try:
            query_embedding = self.embedder.get_embedding(query)
            
            print(f"\n디버깅 정보:")
            print(f"- 쿼리: {query}")
            print(f"- 임베딩 차원: {len(query_embedding)}")
            print(f"- 검색 대상 ID 수: {len(policy_ids) if policy_ids else '전체 인덱스'}")
            if policy_ids:
                print(f"- 검색할 ID 목록 (상위 5개): {policy_ids[:5]}")

            # Search entire index since query-only search is requested
            results = self.index.query(
                namespace="",
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            matches = results.matches
            print(f"- 검색 결과: {len(matches)} 매칭")

            # Apply similarity threshold
            filtered_matches = [match for match in matches if match.score >= similarity_threshold]
            print(f"- 유사도 임계값({similarity_threshold}) 적용 후 매칭된 정책 수: {len(filtered_matches)}")

            if filtered_matches:
                print("\n매칭된 정책 상세:")
                for idx, match in enumerate(filtered_matches[:top_k], 1):
                    print(f"\n[매칭 {idx}]")
                    print(f"ID: {match.id}")
                    print(f"유사도 점수: {match.score:.4f}")
                    if hasattr(match, 'metadata') and match.metadata:
                        text = match.metadata.get('text', '')
                        print(f"정책명: {text[:100]}...")

            return {
                "matches": [
                    {
                        "id": str(match.id),
                        "score": float(match.score),
                        "metadata": match.metadata if hasattr(match, 'metadata') else {}
                    } for match in filtered_matches[:top_k]
                ]
            }
        except Exception as e:
            print(f"\nPinecone 검색 에러: {str(e)}")
            print(f"에러 타입: {type(e).__name__}")
            return {"matches": []}
        
    def hybrid_search(self,
                     query: str,
                     min_age: Optional[int] = None,
                     max_age: Optional[int] = None,
                     region: Optional[str] = None,
                     category: Optional[str] = None,
                     top_k: int = 3):
        """하이브리드 검색 수행"""
        filtered_ids = self.filter_by_conditions(
            query=query,
            min_age=min_age,
            max_age=max_age,
            region=region,
            category=category
        )
        if not filtered_ids:
            return {"message": "조건에 맞는 정책이 없습니다."}

        semantic_results = self.semantic_search(query, filtered_ids, top_k)
        results = []
        for match in semantic_results["matches"]:
            policy_detail = self.policy_collection.find_one({"plcyNo": match["id"]})
            if policy_detail:
                results.append({
                    "id": match["id"],
                    "similarity": match["score"],
                    "title": policy_detail.get("plcyNm"),
                    "description": policy_detail.get("plcyExplnCn"),
                    "category": policy_detail.get("lclsfNm"),
                    "target_age": f"{policy_detail.get('sprtTrgtMinAge')}~{policy_detail.get('sprtTrgtMaxAge')}",
                    "organization": policy_detail.get("rgtrInstCdNm"),
                    "support_content": policy_detail.get("plcySprtCn")
                })
        return results
    
    @staticmethod
    def serialize_mongo_doc(doc: Dict) -> Dict:
        """MongoDB 문서에서 ObjectId를 문자열로 변환"""
        if not doc:
            return {}
        serialized = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                serialized[key] = str(value)
            else:
                serialized[key] = value
        return serialized