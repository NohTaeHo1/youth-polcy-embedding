# app/pipeline_orchestrator.py

from app.crawl.youth_policy_api import fetch_all_policies
from app.database.mongodb import insert_policies
from app.preprocess.extract_detail import run_pipeline
from app.preprocess.extract_metadata import create_filtered_collection
from app.embedding.embedding_runner import run_embedding_pipeline

def run_full_pipeline():
    # print("\n 1. 정책 데이터 수집 시작...")
    # policies = fetch_all_policies()
    # print("정책 데이터를 origin_db에 저장 중...")
    # inserted = insert_policies(policies)

    # if inserted == 0:
    #     print("신규 정책 없음. 파이프라인 종료.")
    #     return

    # print("\n 2. detail_db 전처리 시작...")
    # run_pipeline()

    # print("\n 3. metadata_db 추출 시작...")
    # fields_to_exclude = ["_id", "plcyRealmName", "cnsgNm", "accrueTrgtCn"]  # 필요에 따라 조정
    # create_filtered_collection(
    #     source_collection_name="detail_db",
    #     target_collection_name="metadata_db",
    #     fields_to_exclude=fields_to_exclude,
    #     overwrite_target=False
    # )

    print("\n 4. Pinecone 임베딩 시작...")
    run_embedding_pipeline()

    print("\n 5. 전체 파이프라인 완료")