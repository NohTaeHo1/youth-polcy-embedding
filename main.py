from contextlib import asynccontextmanager
from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import uvicorn

from app.services.pipeline_orchestrator import run_full_pipeline

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

@app.get("/")
async def read_root():
    return {"message": "데이터 파이프라인 자동 실행 서버입니다."}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, host="127.0.0.1", port=8001, log_level="info")