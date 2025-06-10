from app.database.mongodb import create_filtered_collection
# DB_NAME은 mongodb.py 내부에서 app.config의 것을 사용하므로 여기서는 필요 없음

# 이 스크립트의 설정값
SOURCE_COLLECTION_NAME = "detail_policies"
TARGET_COLLECTION_NAME = "metadata_for_embedding"
FIELDS_TO_EXCLUDE = [
    "plcyExplnCn",
    "plcySprtCn",
    "plcyAplyMthdCn",
    "etcMttrCn",
    "aplyUrlAddr",
    "refUrlAddr1",
    "refUrlAddr2",
    "earnEtcCn",
    "srngMthdCn",
    "addAplyQlfcCndCn",
    "ptcpPrpTrgtCn"    
]

def main():
    print(f"'{SOURCE_COLLECTION_NAME}'에서 데이터를 읽어 필터링 후 '{TARGET_COLLECTION_NAME}'에 저장 시작...")
    create_filtered_collection(
        source_collection_name=SOURCE_COLLECTION_NAME,
        target_collection_name=TARGET_COLLECTION_NAME,
        fields_to_exclude=FIELDS_TO_EXCLUDE,
        overwrite_target=True
    )
    print("작업 완료.")

if __name__ == "__main__":
    main()