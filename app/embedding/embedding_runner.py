import requests
from app.database.mongodb import get_collection
from app.database.pinecone import insert_policy_expln_to_pinecone
from app.database.pinecone import get_pinecone_index
import re
import json

EMBED_SERVER_URL = "http://localhost:8000/embed"

import socket

def check_server(host='localhost', port=8000):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("임베딩 서버 연결 가능")
            return True
    except Exception as e:
        print(f"서버 연결 실패: {e}")
        return False

def fetch_metadata_documents(limit=None):
    collection = get_collection("youth_policies", "metadata_db")
    cursor = collection.find({}) 
    if limit:
        cursor = cursor.limit(limit)
    return list(cursor)

FIELD_KO_MAP = {
    "plcyNm": "정책명",
    "plcyKywdNm": "정책키워드",
    "clsfNm": "정책분류",
    "sprvsnInstCdNm": "주관기관",
    "sprtTrgtMinAge": "지원 대상 최소 나이",
    "sprtTrgtMaxAge": "지원 대상 최대 나이",
    "aplyYmd": "신청 기간",
    "sprtArvlSeqYn": "선착순 여부",
    "sprtSclCnt": "지원 인원 수",
    "zipNm": "지역"
}

def choose_particle(label: str) -> str:
    last_char = label[-1]
    code = ord(last_char) - 44032
    jong = code % 28
    return "은" if jong else "는"

def format_aplyYmd(value):
    if not value or value[0] != "기간":
        return "신청 기간은 상시입니다."
    if len(value) >= 3:
        return f"신청 기간은 {value[1]}부터 {value[2]}까지입니다."
    return ""

def format_sprtArvlSeqYn(value):
    if value == "Y":
        return "선착순 접수입니다."
    elif value == "N":
        return "선착순은 아닙니다."
    return ""

def convert_dict_to_string(doc: dict) -> str:
    print(f"🔍 변환 시작: _id={doc.get('_id')}") 
    parts = []

    for k, label in FIELD_KO_MAP.items():
        v = doc.get(k)
        # print(f" - 필드: {k}, 라벨: {label}, 값: {v}")  # 각 필드별 값 로그

        if v is None or (isinstance(v, str) and not v.strip()) or (isinstance(v, list) and len(v) == 0):
            # print(f"   → 무시됨 (빈값)")
            continue

        if k == "aplyYmd":
            result = format_aplyYmd(v)
            print(f"   → 날짜 변환 결과: {result}")
            if result:
                parts.append(result)
            continue

        if k == "sprtArvlSeqYn":
            result = format_sprtArvlSeqYn(v)
            print(f"   → 선착순 변환 결과: {result}")
            if result:
                parts.append(result)
            continue

        if isinstance(v, list):
            v = ", ".join([str(item) for item in v])
            print(f"   → 리스트 변환 후: {v}")

        particle = choose_particle(label)
        sentence = f"{label}{particle} {v} 입니다."
        print(f"   → 최종 문장: {sentence}")

        parts.append(sentence)

    result = " ".join(parts)
    print(f"변환 완료: {result if result else '[빈 문자열]'}")
    return result


def embed_texts(texts: list[str]) -> list[list[float]]:
    payload = {"text": texts}

    try:
        print("전송 payload:")
        print(json.dumps(payload, ensure_ascii=False, indent=2))  # 디버깅용 출력

        response = requests.post(EMBED_SERVER_URL, json=payload)
        response.raise_for_status()

        result = response.json()
        print("서버 응답:", json.dumps(result, ensure_ascii=False, indent=2))

        return result["embeddings"]

    except requests.exceptions.RequestException as e:
        print("요청 에러:", e)
        if response is not None:
            print("응답 상태코드:", response.status_code)
            print("응답 본문:", getattr(response, "text", "응답 없음"))
        raise

    except (KeyError, ValueError) as e:
        print("JSON 파싱 에러 또는 'embeddings' 키 없음:", e)
        raise


def filter_new_documents(docs: list[dict]) -> list[dict]:
    index = get_pinecone_index()
    ids = [str(doc["_id"]) for doc in docs]

    fetch_result = index.fetch(ids=ids)
    existing_ids = set(fetch_result.vectors.keys())

    return [doc for doc in docs if str(doc["_id"]) not in existing_ids]

def run_embedding_pipeline():
    if not check_server():
        print("임베딩 서버 비활성 상태로 파이프라인 중단.")
        return

    print("metadata_db 문서 수집 중...")
    all_docs = fetch_metadata_documents(limit=1000) # Adjust limit as needed
    if not all_docs:
        print("metadata_db에서 문서를 찾을 수 없습니다. 종료.")
        return

    print("Pinecone 미등록 문서 필터링 중...")
    docs = filter_new_documents(all_docs)
    if not docs:
        print("신규 임베딩 대상 없음.")
        return

    ids = [str(doc["_id"]) for doc in docs]
    print(f"임베딩 대상 문서 수: {len(docs)}")
    texts = [convert_dict_to_string(doc) for doc in docs]

    if not texts or not any(text.strip() for text in texts):
        print("유효한 텍스트 없음. 임베딩 중단.")
        return

    if texts:
        for i, text_content in enumerate(texts):
            print(f"--- 문서 {i+1} (_id: {ids[i]}) ---")
            print(text_content)
    else:
        print("임베딩할 텍스트가 없습니다.")
    print("---------------------------------\n")

    all_vectors = []
    processed_ids = []
    processed_texts = []

    print(f"임베딩 요청 중... (총 {len(texts)}건, 개별 요청으로 처리)")

    for i, text_to_embed in enumerate(texts):
        current_id = ids[i]
        print(f"  - 임베딩 요청 ({i+1}/{len(texts)}): _id={current_id}")

        payload = {"text": text_to_embed}
        try:
            response = requests.post(EMBED_SERVER_URL, json=payload)
            response.raise_for_status()
            
            response_data = response.json()
            vector = None

            if "embeddings" in response_data:
                result_val = response_data["embeddings"]
                if isinstance(result_val, list):
                    if len(result_val) > 0 and isinstance(result_val[0], (int, float)): 
                        vector = result_val
                    elif len(result_val) > 0 and isinstance(result_val[0], list):
                        vector = result_val[0]
                    else: 
                        print(f"'{current_id}'에 대한 'embeddings' 키의 값이 비었거나 예상한 벡터 형식이 아님: {result_val}")
                else: 
                     print(f"'{current_id}'에 대한 'embeddings' 키의 값이 리스트가 아님: {result_val}")
            elif "embedding" in response_data: 
                result_val = response_data["embedding"]
                if isinstance(result_val, list) and len(result_val) > 0 and isinstance(result_val[0], (int, float)):
                     vector = result_val
                else:
                    print(f"'{current_id}'에 대한 'embedding' 키의 값이 예상한 벡터 형식이 아님: {result_val}")

            if vector is None or not (isinstance(vector, list) and all(isinstance(num, (int, float)) for num in vector)):
                print(f"'{current_id}'에 대한 응답에서 유효한 벡터(list of numbers)를 추출하지 못했습니다.")
                print("서버 응답:", response.text) 
                continue 
                
            all_vectors.append(vector)
            processed_ids.append(current_id)
            processed_texts.append(text_to_embed)

        except requests.exceptions.RequestException as e_req:
            print(f"요청 에러 (_id={current_id}): {e_req}")
            continue
        except json.JSONDecodeError as e_json_decode: 
            print(f"JSON 파싱 에러 (_id={current_id}): {e_json_decode}")
            print("📬 서버 응답 (텍스트):", getattr(response, "text", "응답 내용 없음"))
            continue
        except Exception as e_generic: 
            print(f"처리 중 예외 발생 (_id={current_id}): {e_generic}")
            
            print("📬 서버 응답 (가능한 경우):", getattr(locals().get("response", None), "text", "응답 내용 없음"))
            continue 
    
    if not all_vectors:
        print("최종적으로 처리된 임베딩 벡터가 없습니다. Pinecone 저장 중단.")
        return
    
    if not (len(processed_ids) == len(all_vectors) == len(processed_texts)):
        print(f"데이터 무결성 오류: ID({len(processed_ids)}), 벡터({len(all_vectors)}), 텍스트({len(processed_texts)}) 개수 불일치. Pinecone 저장 중단.")
        return

    print(f"총 {len(all_vectors)}건의 벡터 Pinecone 저장 시작...")
    insert_policy_expln_to_pinecone(processed_ids, all_vectors, processed_texts)
    print("임베딩 파이프라인 완료")