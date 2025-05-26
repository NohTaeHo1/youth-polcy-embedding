from app.database.mongodb import get_collection
from app.preprocess.modules.field_selector import extract_raw_fields
from app.preprocess.modules.field_processor import process_fields



def run_pipeline(
    db_name="youth_policies",
    raw_collection_name="seoul_policies",
    processed_collection_name="metadata_store"
):
    raw_col = get_collection(db_name, raw_collection_name)
    processed_col = get_collection(db_name, processed_collection_name)

    processed_count = 0
    skipped_count = 0
    error_count = 0

    for raw_doc in raw_col.find():
        try:
            extracted = extract_raw_fields(raw_doc)
            processed = process_fields(extracted)

            # 중복 확인 후 insert만 수행
            if processed_col.count_documents({"plcyNo": processed["plcyNo"]}) == 0:
                processed_col.insert_one(processed)
                processed_count += 1
            else:
                skipped_count += 1

        except Exception as e:
            error_count += 1
            print(f"Error on plcyNo {raw_doc.get('plcyNo')}: {e}")

    print(f"✔ 처리 완료: 성공 {processed_count}건, 중복 {skipped_count}건, 실패 {error_count}건")
if __name__ == "__main__":
    run_pipeline()
