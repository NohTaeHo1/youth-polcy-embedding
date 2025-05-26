import csv
from pymongo import MongoClient
from app.config import MONGO_URI


def export_selected_fields_to_csv(
    db_name="youth_policies",
    collection_name="metadata_store",
    output_path="exported_policies.csv",
    fields=None
):
    if fields is None:
        fields = [
            "plcyNo",
            "plcyExplnCn",
        ]

    client = MongoClient(MONGO_URI)
    db = client[db_name]
    collection = db[collection_name]

    with open(output_path, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()

        for doc in collection.find({}, {field: 1 for field in fields}):
            # 리스트는 문자열로 변환
            row = {field: ", ".join(doc[field]) if isinstance(doc.get(field), list) else doc.get(field, "") for field in fields}
            writer.writerow(row)

    print(f"✔ CSV 파일 저장 완료: {output_path}")


if __name__ == "__main__":
    export_selected_fields_to_csv()
