import csv
import os
import sys
from pymongo import MongoClient

# --- 프로젝트 루트 경로 설정 ---
# 이 스크립트가 있는 폴더의 부모 폴더를 프로젝트 루트로 가정합니다.
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

try:
    from app.config import MONGO_URI # MONGO_URI가 app/config.py에 있다고 가정
except ModuleNotFoundError:
    print("오류: app.config에서 MONGO_URI를 가져올 수 없습니다.")
    print("app/config.py 파일이 존재하고 MONGO_URI 변수가 정의되어 있는지 확인하세요.")
    print(f"현재 sys.path: {sys.path}")
    sys.exit(1)
except ImportError:
    print("오류: MONGO_URI 임포트 중 문제가 발생했습니다. app.config 파일 내용을 확인하세요.")
    sys.exit(1)

# --- 설정 ---
DB_NAME = "youth_policies" # 사용할 데이터베이스 이름
# OUTPUT_DIR는 스크립트가 있는 폴더(extract_data) 내의 data_results 폴더를 의미
OUTPUT_BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # 현재 스크립트가 있는 폴더
OUTPUT_DIR = os.path.join(OUTPUT_BASE_DIR, 'data_results')
# --- ---

def export_all_fields_to_csv(
    db_name: str,
    collection_name: str, # 이제 컬렉션 이름을 파라미터로 받습니다.
    output_dir: str
):
    """
    지정된 MongoDB 컬렉션의 모든 문서를 가져와 모든 필드를 CSV 파일로 저장합니다.
    파일 이름은 컬렉션 이름을 기반으로 생성됩니다.
    """
    client = MongoClient(MONGO_URI)
    db = client[db_name]
    collection = db[collection_name]

    # 출력 디렉토리가 없으면 생성
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            print(f"출력 디렉토리 생성: {output_dir}")
        except OSError as e:
            print(f"출력 디렉토리 생성 실패: {e}. 현재 디렉토리에 저장 시도.")
            output_dir = "." # 현재 디렉토리로 변경 (선택적)


    output_filename = f"mongodb_{collection_name}_데이터.csv"
    output_path = os.path.join(output_dir, output_filename)

    print(f"'{db_name}' 데이터베이스의 '{collection_name}' 컬렉션에서 데이터 추출 중...")
    
    # 첫 번째 문서를 가져와 모든 필드 이름을 얻습니다.
    # 컬렉션이 비어있을 경우를 대비해야 합니다.
    first_doc = collection.find_one()
    if not first_doc:
        print(f"'{collection_name}' 컬렉션에 문서가 없습니다. CSV 파일을 생성하지 않습니다.")
        client.close()
        return

    # 모든 필드 이름을 헤더로 사용 (순서는 보장되지 않을 수 있으나, DictWriter가 처리)
    # _id 필드도 포함됩니다. 제외하고 싶다면 리스트에서 제거할 수 있습니다.
    fieldnames = list(first_doc.keys())
    # 예: fieldnames.remove('_id') # _id 제외 시

    print(f"CSV 파일 헤더 (필드 목록): {fieldnames}")

    try:
        with open(output_path, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            # 모든 문서 가져오기 (모든 필드 포함)
            for doc_count, doc in enumerate(collection.find({})):
                # 리스트나 딕셔너리 타입의 필드는 문자열로 변환 (선택적)
                # CSV는 복잡한 구조를 그대로 표현하기 어렵습니다.
                processed_row = {}
                for field in fieldnames:
                    value = doc.get(field, "") # 필드가 없는 경우 빈 문자열
                    if isinstance(value, list):
                        processed_row[field] = ", ".join(map(str, value)) # 리스트를 문자열로
                    elif isinstance(value, dict):
                        processed_row[field] = str(value) # 딕셔너리를 문자열로 (json.dumps도 고려 가능)
                    else:
                        processed_row[field] = value
                writer.writerow(processed_row)
                if (doc_count + 1) % 100 == 0:
                    print(f"{doc_count + 1}개 문서 처리 완료...")
        
        print(f"✔ CSV 파일 저장 완료: {output_path}")

    except Exception as e:
        print(f"CSV 파일 저장 중 오류 발생: {e}")
    finally:
        client.close()
        print("MongoDB 연결 종료.")


if __name__ == "__main__":

    target_collection_name = "origin_db" 

    if not target_collection_name:
        print("컬렉션 이름이 제공되지 않았습니다. 프로그램을 종료합니다.")
    else:
        export_all_fields_to_csv(
            db_name=DB_NAME,
            collection_name=target_collection_name,
            output_dir=OUTPUT_DIR
        )

    # 다른 컬렉션도 추출하고 싶다면 함수를 다시 호출
    # target_collection_name_2 = "another_collection"
    # if target_collection_name_2:
    # export_all_fields_to_csv(DB_NAME, target_collection_name_2, OUTPUT_DIR)