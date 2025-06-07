from contextlib import asynccontextmanager
from fastapi import FastAPI, Query
from typing import Optional, Dict
from app.database.hybrid_search import HybridSearcher
from app.database.mongodb import get_mongo_client
from app.services.pipeline_orchestrator import run_full_pipeline
from app.llm.ollama_api import OllamaChatClient
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

scheduler = AsyncIOScheduler()

def scheduled_job():
    print("스케줄된 작업 시작작")
    try:
        run_full_pipeline()
        print("스케줄된 작업 완료")
    except Exception as e:
        print(f"스케줄된 작업 오류 발생: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI 서버가 시작되었습니다.")
    try:
        run_full_pipeline()
        print("서버 시작 작업 완료")
    except Exception as e:
        print(f"서버 시작 작업 오류 발생: {e}")

    hour=1
    minute=0
    second=0

    scheduler.add_job(scheduled_job, CronTrigger(hour=hour, minute=minute, second=second, timezone='Asia/Seoul'), id="daily_pipeline_run")
    scheduler.start()
    print(f"스케줄 등록 완료 /n매일 {hour}시 {minute}분 {second}초에 업데이트 작업이 실행됩니다.")

    yield
    
    if scheduler.running:
        scheduler.shutdown()
    print("서버가 종료됩니다. 스케줄러가 중지되었습니다.")

app = FastAPI(lifespan=lifespan)

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
async def llm_predict(
    query: str,
    model: str = "gemma-3 1b",
    top_k: int = 3
) -> Dict:
    """
    LLM 모델을 사용한 예측 API

    Parameters:
    - query: 검색할 텍스트
    - model: 사용할 LLM 모델 (기본값: gemma-3 1b)
    - top_k: 반환할 결과 수 (기본값: 3)

    Returns:
    - results: 예측 결과 목록
    """
    client = OllamaChatClient()
    response = await client.send_request([{"role": "user", "content": query}])
    return response
