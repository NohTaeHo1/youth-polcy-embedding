from app.database.hybrid_search import HybridSearcher

def hybrid_search_flow():
    """Pinecone 쿼리 기반 의미 검색 테스트"""
    print("\n=== Pinecone 의미 검색 테스트 ===")
    
    print("\n1. Pinecone 의미 검색 단계")
    searcher = HybridSearcher()
    test_query = "구직자를 위한 취업 지원 정책을 찾고 있어"
    print(f"검색 쿼리: {test_query}")
    
    semantic_results = searcher.semantic_search(
        query=test_query,
        policy_ids=None,  # No filtering by IDs
        top_k=3,
        similarity_threshold=0.01
    )
    
    print("\n=== 최종 검색 결과 ===")
    if not semantic_results.get("matches"):
        print("의미적으로 유사한 정책을 찾지 못했습니다.")
        return
        
    for idx, match in enumerate(semantic_results["matches"], 1):
        policy = searcher.policy_collection.find_one({"plcyNo": match["id"]})
        if policy:
            print(f"\n[결과 {idx}]")
            print(f"ID: {match['id']}")
            print(f"정책명: {policy.get('plcyNm')}")
            print(f"유사도 점수: {match['score']:.4f}")
            print(f"지원연령: {policy.get('sprtTrgtMinAge')}~{policy.get('sprtTrgtMaxAge')}세")
            print(f"카테고리: {policy.get('clsfNm')}")
            print(f"지역: {policy.get('rgtrInstCdNm')}")
            print(f"지원내용: {policy.get('plcySprtCn', '')[:200]}...")
        else:
            print(f"\n[결과 {idx}]")
            print(f"ID: {match['id']}")
            print(f"유사도 점수: {match['score']:.4f}")
            print(f"Pinecone 메타데이터: {match['metadata'].get('text', '')[:100]}...")
            print("MongoDB에서 해당 정책을 찾지 못했습니다.")

if __name__ == "__main__":
    hybrid_search_flow()