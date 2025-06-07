from contextlib import asynccontextmanager
from fastapi import FastAPI, Query
from typing import Optional, Dict
from app.database.hybrid_search import HybridSearcher
from app.database.mongodb import get_mongo_client
from app.services.pipeline_orchestrator import run_full_pipeline
from app.llm.ollama_api import OllamaChatClient
from app.llm.llm_promptHandler import rag_prompt
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# scheduler = AsyncIOScheduler()

# def scheduled_job():
#     print("스케줄된 작업 시작작")
#     try:
#         run_full_pipeline()
#         print("스케줄된 작업 완료")
#     except Exception as e:
#         print(f"스케줄된 작업 오류 발생: {e}")

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     print("FastAPI 서버가 시작되었습니다.")
#     try:
#         run_full_pipeline()
#         print("서버 시작 작업 완료")
#     except Exception as e:
#         print(f"서버 시작 작업 오류 발생: {e}")

#     hour=1
#     minute=0
#     second=0

#     scheduler.add_job(scheduled_job, CronTrigger(hour=hour, minute=minute, second=second, timezone='Asia/Seoul'), id="daily_pipeline_run")
#     scheduler.start()
#     print(f"스케줄 등록 완료 /n매일 {hour}시 {minute}분 {second}초에 업데이트 작업이 실행됩니다.")

#     yield
    
#     if scheduler.running:
#         scheduler.shutdown()
#     print("서버가 종료됩니다. 스케줄러가 중지되었습니다.")

# app = FastAPI(lifespan=lifespan)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 *로, 배포 시에는 도메인 지정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "데이터 파이프라인 자동 실행 서버입니다."}

# if __name__ == "__main__":
#     uvicorn.run("main:app", reload=True, host="127.0.0.1", port=8001, log_level="info")


# from app.database.mongodb import get_mongo_client
# import json
# from bson import json_util

# @app.get("/mongo/collections")
# def list_collections_and_fields(db_name: str = "youth_policies"):
#     client = get_mongo_client()
#     db = client[db_name]
#     result = {}
#     for name in db.list_collection_names():
#         # 각 컬렉션에서 샘플 1개 문서의 키만 추출
#         doc = db[name].find_one()
#         if doc:
#             # ObjectId를 문자열로 변환
#             doc_str = json.loads(json_util.dumps(doc))
#             result[name] = doc_str
#     return result

class SearchRequest(BaseModel):
    query: str
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    model: Optional[str] = "gemma3:1b"  # LLM 모델 이름
    region: Optional[str] = None
    category: Optional[str] = None
    top_k: int = 3

@app.post("/search/hybrid")
async def hybrid_search(
    request: SearchRequest
) -> Dict:
    """
    MongoDB 필터링과 Pinecone 의미 검색을 결합한 하이브리드 검색 API
    
    Parameters:
    - request: SearchRequest 모델
        - query: 검색할 텍스트
        - min_age: 최소 나이 필터 (선택)
        - max_age: 최대 나이 필터 (선택)
        - region: 지역 필터 (선택)
        - category: 카테고리 필터 (선택)
        - top_k: 반환할 결과 수 (기본값: 3)
    
    Returns:
    - results: 검색 결과 목록
    - metadata: 검색 메타데이터
    """
    try:
        searcher = HybridSearcher()
        
        # 1. MongoDB 필터링
        filtered_ids = searcher.filter_by_conditions(
            min_age=request.min_age,
            max_age=request.max_age,
            region=request.region,
            category=request.category
        )
        
        if not filtered_ids:
            return {
                "status": "no_results",
                "message": "조건에 맞는 정책이 없습니다.",
                "results": [],
                "metadata": {
                    "filters_applied": {
                        "min_age": request.min_age,
                        "max_age": request.max_age,
                        "region": request.region,
                        "category": request.category
                    }
                }
            }
        
        # 2. Pinecone 의미 검색
        semantic_results = searcher.semantic_search(
            query=request.query,
            policy_ids=filtered_ids,
            top_k=request.top_k
        )
        
        # 3. 결과 조합 및 상세 정보 추가
        final_results = []
        for match in semantic_results.get("matches", []):
            policy = searcher.policy_collection.find_one({"plcyNo": match["id"]})
            if policy:
                policy_obj = {
                    "title": policy.get("plcyNm"),
                    "age_range": f"{policy.get('sprtTrgtMinAge')}~{policy.get('sprtTrgtMaxAge')}",
                    "category": policy.get("clsfNm"),
                    "region": policy.get("rgtrInstCdNm"),
                    "organization": policy.get("sprvsnInstCdNm"),
                    "description": policy.get("plcyExplnCn", "")[:200],
                    "support_content": policy.get("plcySprtCn", "")[:200]
                }
                final_results.append(policy_obj)
        
        return {
            "status": "success",
            "message": f"{len(final_results)}개의 정책을 찾았습니다.",
            "results": final_results,
            "metadata": {
                "total_filtered": len(filtered_ids),
                "returned_count": len(final_results),
                "filters_applied": {
                    "min_age": request.min_age,
                    "max_age": request.max_age,
                    "region": request.region,
                    "category": request.category
                },
                "query": request.query
            }
        }
    except Exception as e:
        print(f"하이브리드 검색 중 오류 발생: {str(e)}")
        return {
            "status": "error",
            "message": str(e),
            "results": [],
            "metadata": {}
        }
        
        
@app.post("/llm/predict")
async def llm_predict(request: SearchRequest) -> Dict:
    """
    LLM 모델을 사용한 예측 API (RAG 방식)
    """
    # 1. hybrid_search로 정책 context 추출
    searcher = HybridSearcher()
    filtered_ids = searcher.filter_by_conditions(
        min_age=request.min_age,
        max_age=request.max_age,
        region=request.region,
        category=request.category
    )
    semantic_results = searcher.semantic_search(
        query=request.query,
        policy_ids=filtered_ids,
        top_k=request.top_k
    )
    
    # 2. 가장 유사도가 높은 정책 ID 선택
    if not semantic_results.get("matches"):
        return {"message": "조건에 맞는 정책이 없습니다.", "response": ""}

    top_match = max(semantic_results["matches"], key=lambda x: x["score"])
    policy_id = top_match["id"]
    
    # 3. MongoDB에서 정책 데이터 조회
    policy_detail = searcher.policy_collection.find_one({"plcyNo": policy_id})
    if not policy_detail:
        return {"message": f"ID {policy_id}에 해당하는 정책을 찾을 수 없습니다.", "response": ""}
    
    # 4. 정책 데이터를 context로 포맷팅
    context = (
        f"**정책명**: {policy_detail.get('plcyNm', '')}\n"
        f"**설명**: {policy_detail.get('plcyExplnCn', '')}\n"
        f"**카테고리**: {', '.join(policy_detail.get('clsfNm', []))}\n"
        f"**지원 대상 나이**: {policy_detail.get('sprtTrgtMinAge', '')}~{policy_detail.get('sprtTrgtMaxAge', '')}\n"
        f"**주관기관**: {policy_detail.get('rgtrInstCdNm', '')}\n"
        f"**지원 내용**: {policy_detail.get('plcySprtCn', '')}\n"
        f"**신청 기간**: {', '.join(policy_detail.get('aplyYmd', []))}\n"
        f"**신청 방법**: {policy_detail.get('plcyAplyMthdCn', '')}\n"
        f"**연락처**: {policy_detail.get('etcMttrCn', '')}\n"
        f"**추가 신청 조건**: {policy_detail.get('addAplyQlfcCndCn', '')}\n"
        f"**참고 URL**: {policy_detail.get('refUrlAddr1', '')}"
    )
    
    # 5. RAG 프롬프트 생성
    prompt = rag_prompt(context, request.query)
    
    # 6. LLM 호출
    client = OllamaChatClient()
    response = client.send_request(prompt)
    
    # 7. 응답 반환 (policy_detail 직렬화)
    return {
        "policy_id": policy_id,
        "similarity_score": top_match["score"],
        "policy_details": searcher.serialize_mongo_doc(policy_detail),  # ObjectId 직렬화
        "llm_response": response.get("response", "")
    }


# @app.post("/llm/predict")
# async def llm_predict(
#     request: SearchRequest
# ) -> Dict:
#     """
#     LLM 모델을 사용한 예측 API (RAG 방식)
#     """
#     # 1. hybrid_search로 정책 context 추출
#     searcher = HybridSearcher()
#     filtered_ids = searcher.filter_by_conditions()
#     semantic_results = searcher.semantic_search(query=request.query, policy_ids=filtered_ids, top_k=request.top_k)
#     # context 생성 (정책 여러 개면 제목+설명 등 합치기)
#     print(f"semantic_results: {semantic_results}")
#     context = "\n\n".join(
#         f"제목: {policy.get('plcyNm', '')}\n내용: {policy.get('plcyExplnCn', '')}"
#         for match in semantic_results.get("matches", [])
#         if (policy := searcher.policy_collection.find_one({"plcyNo": match["id"]}))
#     )
#     # 2. RAG 프롬프트 생성
#     prompt = rag_prompt(context, request.query)
#     # 3. LLM 호출
#     client = OllamaChatClient()
#     # response = client.send_request(messages=prompt)
#     print(f"LLM 응답: {prompt}")
#     return prompt