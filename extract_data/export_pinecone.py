import os
import sys
import pandas as pd
from pinecone import Pinecone

# --- 프로젝트 루트 경로 설정 ---
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

try:
    from app.config import PINECONE_API_KEY
except ModuleNotFoundError:
    print("오류: app.config에서 PINECONE_API_KEY를 가져올 수 없습니다.")
    print("app/config.py 파일이 존재하고 PINECONE_API_KEY 변수가 정의되어 있는지 확인하세요.")
    print(f"현재 sys.path: {sys.path}")
    sys.exit(1)
except ImportError:
    print("오류: PINECONE_API_KEY 임포트 중 문제가 발생했습니다. app.config 파일 내용을 확인하세요.")
    sys.exit(1)


# --- 설정 ---
INDEX_NAME = "youth-policies-index"
OUTPUT_EXCEL_FILE = "벡터DB 데이터.xlsx"
OUTPUT_DIR = './extract_data/data_results/'
FETCH_BATCH_SIZE = 100 # fetch API의 배치 크기는 그대로 100 또는 그 이상 (최대 1000)으로 둘 수 있습니다.
# --- ---

def fetch_all_vector_ids(index_obj, index_name_str):
    """Pinecone 인덱스에서 모든 벡터 ID를 가져옵니다."""
    all_ids = []
    next_token = None
    print(f"'{index_name_str}' 인덱스에서 모든 벡터 ID를 가져오는 중...")
    try:
        while True:
            # list_paginated의 limit 값을 100 미만으로 수정 (예: 99)
            list_response = index_obj.list_paginated(limit=99, pagination_token=next_token) # <--- 여기를 수정
            if list_response.vectors:
                all_ids.extend([v.id for v in list_response.vectors])
            
            next_token = list_response.pagination and list_response.pagination.next
            if not next_token:
                break
            print(f"현재까지 {len(all_ids)}개의 ID를 가져왔습니다. 다음 페이지 로딩 중...")
        print(f"총 {len(all_ids)}개의 벡터 ID를 찾았습니다.")
        return all_ids
    except Exception as e:
        print(f"벡터 ID 목록을 가져오는 중 오류 발생: {e}")
        return None

# ... (fetch_data_in_batches 및 save_data_to_excel 함수는 변경 없음) ...
def fetch_data_in_batches(index, ids_to_fetch):
    """주어진 ID 목록에 대해 벡터와 메타데이터를 배치로 가져옵니다."""
    all_fetched_data = []
    if not ids_to_fetch:
        return all_fetched_data

    print(f"총 {len(ids_to_fetch)}개의 ID에 대해 벡터 및 메타데이터를 배치로 가져오는 중 (배치 크기: {FETCH_BATCH_SIZE})...")
    for i in range(0, len(ids_to_fetch), FETCH_BATCH_SIZE):
        batch_ids = ids_to_fetch[i:i + FETCH_BATCH_SIZE]
        current_batch_num = i // FETCH_BATCH_SIZE + 1
        total_batches = (len(ids_to_fetch) + FETCH_BATCH_SIZE - 1) // FETCH_BATCH_SIZE
        print(f"배치 {current_batch_num}/{total_batches} (ID 개수: {len(batch_ids)}) 가져오는 중...")
        try:
            fetch_response = index.fetch(ids=batch_ids)
            if fetch_response and fetch_response.vectors:
                for vector_id, vector_data in fetch_response.vectors.items():
                    record = {"id": vector_id}
                    if vector_data.values:
                        for j, val in enumerate(vector_data.values):
                            record[f"vector_{j}"] = val
                    if vector_data.metadata:
                        for meta_key, meta_val in vector_data.metadata.items():
                            record[f"metadata_{meta_key}"] = meta_val
                    all_fetched_data.append(record)
            else:
                print(f"경고: ID 배치에 대해 데이터가 반환되지 않았습니다: {batch_ids}")
        except Exception as e:
            print(f"ID 배치 {batch_ids}를 가져오는 중 오류 발생: {e}")
            
    print(f"{len(all_fetched_data)}개의 벡터에 대한 데이터 가져오기 완료.")
    return all_fetched_data

def save_data_to_excel(data: list, filename: str, output_dir: str):
    """가져온 데이터를 Excel 파일로 저장합니다."""
    if not data:
        print("저장할 데이터가 없습니다.")
        return

    df = pd.DataFrame(data)
    
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            print(f"출력 디렉토리 생성: {output_dir}")
        except OSError as e:
            print(f"출력 디렉토리 생성 실패: {e}. 현재 디렉토리에 저장합니다.")
            output_dir = "."

    filepath = os.path.join(output_dir, filename)
    
    print(f"데이터를 Excel 파일로 저장하는 중: {filepath}...")
    try:
        df.to_excel(filepath, index=False, engine='openpyxl')
        print(f"✅ 데이터 저장 성공: {filepath}")
    except Exception as e:
        print(f"Excel 파일 저장 중 오류 발생: {e}")


if __name__ == "__main__":
    print("Pinecone 데이터 추출 및 Excel 변환 프로세스 시작...")
    
    if not PINECONE_API_KEY or PINECONE_API_KEY == "YOUR_API_KEY" or PINECONE_API_KEY == "여러분의_파인콘_API_키":
        print("오류: PINECONE_API_KEY가 app/config.py에 설정되지 않았거나 플레이스홀더 값입니다.")
        print("app/config.py 파일에 실제 Pinecone API 키를 설정해주세요.")
        sys.exit(1)

    print(f"Pinecone 클라이언트 초기화 (인덱스: '{INDEX_NAME}')...")
    try:
        pc = Pinecone(api_key=PINECONE_API_KEY)
        
        if INDEX_NAME not in pc.list_indexes().names():
            print(f"오류: Pinecone에 '{INDEX_NAME}' 인덱스가 존재하지 않습니다.")
            sys.exit(1)
        
        index = pc.Index(INDEX_NAME)
        print(f"'{INDEX_NAME}' 인덱스에 성공적으로 연결되었습니다.")

        all_ids = fetch_all_vector_ids(index, INDEX_NAME)

        if all_ids is not None: # Check if fetch_all_vector_ids returned successfully
            if all_ids: # Check if any IDs were actually fetched
                fetched_data = fetch_data_in_batches(index, all_ids)
                save_data_to_excel(fetched_data, OUTPUT_EXCEL_FILE, OUTPUT_DIR)
            else:
                print("인덱스에서 가져올 ID가 없습니다. Excel 파일 생성을 건너<0xEB><0x9B><0xB3>니다.")
        else:
            print("벡터 ID를 가져오지 못했습니다. Excel 파일 생성을 건너<0xEB><0x9B><0xB3>니다.") # 깨진 문자 수정

    except Exception as e:
        print(f"프로세스 중 예기치 않은 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        
    print("프로세스 완료.")