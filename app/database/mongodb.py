from pymongo import MongoClient
from app.config import MONGO_URI
import pandas as pd

def get_mongo_client():
    return MongoClient(MONGO_URI)

def insert_policies(policies, db_name="youth_policies", collection_name="seoul_policies"):
    """
    등록 기관명에 '서울'이 포함된 정책만 저장하고, plcyNo 기준 중복 제거
    """
    client = get_mongo_client()
    db = client[db_name]
    collection = db[collection_name]

    inserted_count = 0
    for policy in policies:
        org_name = policy.get("rgtrInstCdNm", "")
        if "서울" not in org_name:
            continue 
        plcy_no = policy.get("plcyNo")
        if not plcy_no:
            continue

        if not collection.find_one({"plcyNo": plcy_no}):
            collection.insert_one(policy)
            inserted_count += 1

    print(f"{inserted_count}건 저장됨 ('서울시' 정책만)")



def export_embeddings_to_excel():
    client = MongoClient(MONGO_URI)
    collection = client["youth_policies"]["processed_policies"]

    cursor = collection.find({}, {"plcyNo": 1, "title": 1, "embedding_text": 1, "_id": 0})
    df = pd.DataFrame(list(cursor))

    df.to_csv("embedding_texts.csv", index=False, encoding='utf-8-sig')
    print("저장 완료: embedding_texts.csv")