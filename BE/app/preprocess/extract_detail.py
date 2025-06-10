from app.database.mongodb import get_collection
from app.preprocess.modules.field_selector import extract_raw_fields
from app.preprocess.modules.field_processor import process_fields


def run_pipeline(
    db_name="youth_policies",
    raw_collection_name="origin_db",
    processed_collection_name="detail_db",
    only_plcy_nos=None  
):
    raw_col = get_collection(db_name, raw_collection_name)
    processed_col = get_collection(db_name, processed_collection_name)

    processed_count = 0
    skipped_count = 0
    error_count = 0

    for raw_doc in raw_col.find():
        try:
            plcy_no = raw_doc.get("plcyNo")

            if only_plcy_nos and plcy_no not in only_plcy_nos:
                continue

            extracted = extract_raw_fields(raw_doc)
            processed = process_fields(extracted)

            if processed_col.count_documents({"plcyNo": processed["plcyNo"]}) == 0:
                processed_col.insert_one(processed)
                processed_count += 1
            else:
                skipped_count += 1

        except Exception as e:
            error_count += 1
            print(f"Error on plcyNo {raw_doc.get('plcyNo')}: {e}")

    print(f"처리 완료: 성공 {processed_count}건, 중복 {skipped_count}건, 실패 {error_count}건")
