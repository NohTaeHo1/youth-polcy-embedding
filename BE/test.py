# from app.database.bybrid_search import HybridSearcher

# def test_youth_policy_search():
#     # HybridSearcher 인스턴스 생성
#     searcher = HybridSearcher()
    
#     # 검색 조건 설정
#     test_query = "구직자를 위한 취업 지원 정책 알려줘"
#     search_results = searcher.hybrid_search(
#         query=test_query,
#         min_age=25,  # 25세
#         max_age=25,  # 25세
#         region="마포구",  # 강서구
#         category="일자리",
#         top_k=3  # 상위 3개 결과
#     )

#     # 결과 출력
#     print("\n=== 검색 조건 ===")
#     print(f"- 나이: 25세")
#     print(f"- 지역: 강서구")
#     print(f"- 상태: 구직중")
#     print(f"- 검색어: {test_query}")
    
#     print("\n=== 검색 결과 ===")
#     if isinstance(search_results, dict) and "message" in search_results:
#         print(search_results["message"])
#         return

#     for idx, result in enumerate(search_results, 1):
#         print(f"\n[결과 {idx}] {result['title']}")
#         print(f"유사도: {result['similarity']:.4f}")
#         print(f"카테고리: {result['category']}")
#         print(f"대상연령: {result['target_age']}")
#         print(f"기관: {result['organization']}")
#         print(f"지원내용: {result['support_content'][:200]}...")

# if __name__ == "__main__":
#     test_youth_policy_search()

from app.database.bybrid_search import HybridSearcher
from pprint import pprint  # 결과를 보기 좋게 출력하기 위해 추가

def test_age_filter():
    searcher = HybridSearcher()
    
    # 나이 조건으로만 필터링 (25세)
    age = 25
    filtered_policies = searcher.filter_by_conditions(
        min_age=age,
        max_age=age,
        category='일자리',
        region='마포구'
    )
    
    # 필터링된 정책 ID로 상세 정보 조회
    print(f"\n=== {age}세 청년 대상 정책 검색 결과 ===")
    print(f"총 {len(filtered_policies)}개 정책 찾음\n")
    
    # 각 정책의 상세 정보 출력
    for policy_id in filtered_policies[:5]:  # 처음 5개만 출력
        policy = searcher.policy_collection.find_one({"plcyNo": policy_id})
        if policy:
            print("\n---정책 정보---")
            print(f"정책명: {policy.get('plcyNm')}")
            print(f"지원연령: {policy.get('sprtTrgtMinAge')}~{policy.get('sprtTrgtMaxAge')}세")
            print(f"카테고리: {policy.get('lclsfNm')}")
            print(f"키워드: {policy.get('plcyKywdNm')}")
            print(f"기관: {policy.get('rgtrInstCdNm')}")
            print(f"지원내용: {policy.get('plcySprtCn')[:200]}...")

if __name__ == "__main__":
    test_age_filter()