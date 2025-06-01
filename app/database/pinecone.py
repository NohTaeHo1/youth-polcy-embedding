# app/database/pinecone.py

from pinecone import Pinecone, PodSpec
from app.config import PINECONE_API_KEY, PINECONE_ENVIRONMENT

INDEX_NAME = "youth-policies-index"
DIMENSION = 1024

pc = Pinecone(api_key=PINECONE_API_KEY)

def get_pinecone_index():
    """
    Pinecone 인덱스 객체를 반환
    인덱스가 없으면 생성
    """
    list_response = pc.list_indexes()


    if hasattr(list_response, 'names') and callable(list_response.names): 
        current_indexes_list = list_response.names()

    elif hasattr(list_response, 'indexes') and isinstance(list_response.indexes, list):
        current_indexes_list = []
        for idx_info in list_response.indexes:
            if hasattr(idx_info, 'name'):
                current_indexes_list.append(idx_info.name)
            else:
                print(f"idx_info 객체에 'name' 속성이 없습니다: {idx_info}")
    else:
        print("pc.list_indexes()가 반환한 객체에서 인덱스 이름 목록을 직접 추출할 수 있는 'names' 또는 'indexes' 속성을 찾지 못했습니다.")
        current_indexes_list = []

    if not isinstance(current_indexes_list, list):
        print(f"경고: current_indexes_list가 리스트가 아닙니다! 실제 타입: {type(current_indexes_list)}")

    if INDEX_NAME not in current_indexes_list:
        print(f"인덱스 '{INDEX_NAME}'를 찾을 수 없습니다. 새로 생성합니다...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=DIMENSION,
            metric="cosine",
            spec=PodSpec(environment=PINECONE_ENVIRONMENT)
        )
        print(f"인덱스 '{INDEX_NAME}' 생성 완료.")
    else:
        print(f"기존 인덱스 '{INDEX_NAME}'를 사용합니다.")
    
    return pc.Index(INDEX_NAME)

def insert_policy_expln_to_pinecone(ids, vectors, texts):
    print("Pinecone 인덱스 객체를 가져오는 중...")
    index = get_pinecone_index()

    items = [
        (str(pid), vector, {"text": text})
        for pid, vector, text in zip(ids, vectors, texts)
    ]
    print(f"Pinecone에 업서트할 {len(items)}개의 아이템 준비 완료.")

    for i in range(0, len(items), 100):
        batch = items[i:i + 100]
        print(f"배치 {i//100 + 1}: {len(batch)}개의 아이템을 업서트하는 중...")
        index.upsert(vectors=batch)

    print(f"Pinecone에 {len(items)}건 저장 완료.")