from fastapi import FastAPI

# from app.routes.schedule_route import start_scheduler, shutdown_scheduler
# from app.routes.startup_route import save_mongodb

app = FastAPI()


# @app.get("/")
# async def read_root():
#     return {"Hello": "World"}


# @app.on_event("startup")
# async def startup():
#     start_scheduler()
#     await save_mongodb()


# @app.on_event("shutdown")
# def shutdown():
#     shutdown_scheduler()


# if __name__ == '__main__':
    # import uvicorn
    # uvicorn.run("main:app", reload=True, host="127.0.0.1", port=8000, log_level="info")

from app.database.mongodb import insert_policies, export_embeddings_to_excel
from app.preprocess.run_pipeline import run_pipeline
def main():
    # policies = fetch_all_policies()
    # if not policies:
    #     print("정책 데이터가 없습니다. 종료합니다.")
    #     return

    # insert_policies(policies)  
    # update_processed_policies()
    # export_embeddings_to_excel()
    # process_and_save_policies()
    run_pipeline()



# unvicorn main:app --reload --host 실행을 위한 아래는 주석 처리.
# if __name__ == "__main__":
#     main()
