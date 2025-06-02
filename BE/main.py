<<<<<<< HEAD:main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import uvicorn

from app.services.pipeline_orchestrator import run_full_pipeline

scheduler = AsyncIOScheduler()
=======
from fastapi import FastAPI

from app.database.mongodb import insert_policies, export_embeddings_to_excel
from app.preprocess.run_pipeline import run_pipeline
# from app.routes.schedule_route import start_scheduler, shutdown_scheduler
# from app.routes.startup_route import save_mongodb

app = FastAPI()
>>>>>>> service:BE/main.py

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

<<<<<<< HEAD:main.py
app = FastAPI(lifespan=lifespan)

@app.get("/")
async def read_root():
    return {"message": "데이터 파이프라인 자동 실행 서버입니다."}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, host="127.0.0.1", port=8001, log_level="info")
=======
# @app.on_event("shutdown")
# def shutdown():
#     shutdown_scheduler()


# if __name__ == '__main__':
    # import uvicorn
    # uvicorn.run("main:app", reload=True, host="127.0.0.1", port=8000, log_level="info")

# def main():
    # policies = fetch_all_policies()
    # if not policies:
    #     print("정책 데이터가 없습니다. 종료합니다.")
    #     return

    # insert_policies(policies)  
    # update_processed_policies()
    # export_embeddings_to_excel()
    # process_and_save_policies()
    # run_pipeline()

from app.database.mongodb import get_mongo_client
import json
from bson import json_util

@app.get("/mongo/collections")
def list_collections_and_fields(db_name: str = "youth_policies"):
    client = get_mongo_client()
    db = client[db_name]
    result = {}
    for name in db.list_collection_names():
        # 각 컬렉션에서 샘플 1개 문서의 키만 추출
        doc = db[name].find_one()
        if doc:
            # ObjectId를 문자열로 변환
            doc_str = json.loads(json_util.dumps(doc))
            result[name] = doc_str
    return result

# unvicorn main:app --reload --host 실행을 위한 아래는 주석 처리.
# if __name__ == "__main__":
#     main()
>>>>>>> service:BE/main.py
