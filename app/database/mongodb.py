# app/db/mongodb.py
from pymongo import MongoClient
from app.config import MONGO_URI

def get_mongo_client():
    return MongoClient(MONGO_URI)

def insert_policies(policies, db_name="youth_policies", collection_name="seoul_policies"):
    """
    등록 기관명에 '서울'이 포함된 정책만 저장하고, plcyNo 기준 중복 제거
    """
    client = get_mongo_client()
    db = client[db_name]
    collection = db[collection_name]

    # 기존 데이터 삭제 (선택사항: 주석 처리 가능)
    # collection.delete_many({})

    inserted_count = 0
    for policy in policies:
        org_name = policy.get("rgtrInstCdNm", "")
        if "서울" not in org_name:
            continue  # '서울'이 포함되지 않으면 건너뜀

        plcy_no = policy.get("plcyNo")
        if not plcy_no:
            continue

        if not collection.find_one({"plcyNo": plcy_no}):
            collection.insert_one(policy)
            inserted_count += 1

    print(f"{inserted_count}건 저장됨 ('서울' 포함 정책만)")


