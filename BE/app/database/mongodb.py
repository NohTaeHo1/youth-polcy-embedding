from pymongo import MongoClient
from app.config import MONGO_URI
import pandas as pd

def get_mongo_client():
    return MongoClient(MONGO_URI)

def insert_policies(policies, db_name="youth_policies", collection_name="origin_db"):
    """
    등록 기관명에 '서울'이 포함된 정책만 저장하고, plcyNo 기준 중복 제거
    → 저장된 정책의 plcyNo 리스트 반환
    """
    client = get_mongo_client()
    db = client[db_name]
    collection = db[collection_name]

    inserted_count = 0
    inserted_plcy_nos = []

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
            inserted_plcy_nos.append(plcy_no)

    print(f"{inserted_count}건 저장됨 ('서울시' 정책만)")
    return inserted_plcy_nos


def export_embeddings_to_excel():
    client = MongoClient(MONGO_URI)
    collection = client["youth_policies"]["processed_policies"]

    cursor = collection.find({}, {"plcyNo": 1, "title": 1, "embedding_text": 1, "_id": 0})
    df = pd.DataFrame(list(cursor))

    df.to_csv("embedding_texts.csv", index=False, encoding='utf-8-sig')
    print("저장 완료: embedding_texts.csv")


def get_collection(db_name: str, collection_name: str):
    client = MongoClient(MONGO_URI)
    return client[db_name][collection_name]

def fetch_policy_expln_texts(limit=None):
    client = MongoClient(MONGO_URI)
    collection = client["youth_policies"]["detail_db"]
    query = {"plcyExplnCn": {"$exists": True, "$ne": ""}}
    projection = {"plcyNo": 1, "plcyExplnCn": 1}
    cursor = collection.find(query, projection)
    if limit:
        cursor = cursor.limit(limit)
    return list(cursor)


def create_filtered_collection(source_collection_name: str, 
                               target_collection_name: str, 
                               fields_to_exclude: list, 
                               overwrite_target: bool = False,
                               only_plcy_nos: list = None):  # ⬅️ 추가
    """
    소스 컬렉션에서 특정 필드를 제외하고 타겟 컬렉션에 문서를 저장
    only_plcy_nos: 지정된 plcyNo 리스트가 있을 경우 해당 정책만 처리
    """
    client = get_mongo_client()
    db = client['youth_policies']
    source_collection = db[source_collection_name]
    target_collection = db[target_collection_name]

    if overwrite_target:
        delete_result = target_collection.delete_many({})
        print(f"기존 '{target_collection_name}' 컬렉션의 {delete_result.deleted_count}개 문서가 삭제되었습니다.")

    processed_count = 0
    skipped_count = 0

    for doc in source_collection.find():
        policy_no = doc.get("plcyNo")

        if only_plcy_nos and policy_no not in only_plcy_nos:
            continue

        if policy_no and target_collection.count_documents({"plcyNo": policy_no}) > 0:
            skipped_count += 1
            continue

        new_doc = {}
        for key, value in doc.items():
            if key not in fields_to_exclude:
                new_doc[key] = value

        if policy_no:
            new_doc["_id"] = policy_no

        if new_doc:
            try:
                target_collection.insert_one(new_doc)
                processed_count += 1
            except Exception:
                skipped_count += 1

    print(f"--- '{target_collection_name}' 저장 결과 ---")
    print(f"총 {processed_count}개의 문서가 저장되었습니다.")
    if skipped_count > 0:
        print(f"{skipped_count}개의 문서는 중복 또는 오류로 건너뛰었거나 삽입에 실패했습니다.")


