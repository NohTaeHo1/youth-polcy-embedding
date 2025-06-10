from app.database.bybrid_search import HybridSearcher

def check_mongodb_data(age: int = None,
                       region: str = None,
                       category: str = None):
    searcher = HybridSearcher()
    
    print("\n=== MongoDB 데이터 구조 확인 ===")
    sample = searcher.policy_collection.find_one()
    if sample:
        print("샘플 문서 필드:")
        print(sample.keys())
        print(f"최소 나이: {sample.get('sprtTrgtMinAge')}")
        print(f"최대 나이: {sample.get('sprtTrgtMaxAge')}")
    else:
        print("컬렉션이 비어있습니다")
    # 검색 조건
    search_params = {
        "age": 25,
        "region": "서울특별시",
        "category": "일자리"
    }
    
    # 필터링 수행
    results = searcher.filter_by_conditions(
        min_age=search_params["age"],
        max_age=search_params["age"],
        region=search_params["region"],
        category=search_params["category"]
    )
    # # 단일 필터링 테스트
    # print("\n=== 조건별 필터링 결과 ===")
    # results = searcher.filter_by_conditions(
    #     min_age=25,
    #     max_age=25,
    #     region="서울특별시",
    #     category="일자리"
    # )

    if isinstance(results, dict):  # 우선순위별 결과를 반환하는 경우
        for match_type, policies in results.items():
            if policies:  # 결과가 있는 경우만 출력
                print(f"\n[{match_type}]")
                print(f"매칭된 정책 수: {len(policies)}")
                print("정책 ID (상위 5개):", policies[:5])
                
                # 첫 번째 정책의 상세 정보 출력
                if policies:
                    first_policy = searcher.policy_collection.find_one({"plcyNo": policies[0]})
                    if first_policy:
                        print("\n첫 번째 매칭 정책 상세정보:")
                        print(f"제목: {first_policy.get('plcyNm')}")
                        print(f"연령: {first_policy.get('sprtTrgtMinAge')}~{first_policy.get('sprtTrgtMaxAge')}")
                        print(f"카테고리: {first_policy.get('clsfNm')}")
                        print(f"지역: {first_policy.get('rgtrInstCdNm')}")
                        return policies
    else:  # 단순 리스트를 반환하는 경우
        print(f"\n총 매칭된 정책 수: {len(results)}")
        print(f"매칭된 정책 ID (상위 5개): {results[:5]}")
        
        if results:  # 결과가 있는 경우 첫 번째 정책 상세 정보 출력
            first_policy = searcher.policy_collection.find_one({"plcyNo": results[0]})
            if first_policy:
                print("\n첫 번째 매칭 정책 상세정보:")
                print(f"제목: {first_policy.get('plcyNm')}")
                print(f"연령: {first_policy.get('sprtTrgtMinAge')}~{first_policy.get('sprtTrgtMaxAge')}")
                print(f"카테고리: {first_policy.get('clsfNm')}")
                print(f"지역: {first_policy.get('rgtrInstCdNm')}")
                return first_policy