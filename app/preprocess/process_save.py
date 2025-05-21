# app/preprocess/process_and_save.py

from pymongo import MongoClient
import re
from app.config import MONGO_URI

# 지역코드 → 지역명 매핑 (예시 일부)
zip_to_region = {
    "11110": "서울 종로구 청운효자동", "11140": "서울 종로구 사직동", "11170": "서울 종로구 삼청동",
    "11200": "서울 종로구 종로1.2.3.4가동", "11215": "서울 종로구 혜화동",
    "11230": "서울 중구 소공동", "11260": "서울 중구 신당동", "11290": "서울 용산구 후암동"
    # 전체 매핑 필요 시 추가
}

# 기호 제거 + 문장화
def normalize_text(raw: str) -> str:
    lines = raw.splitlines()
    result = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        line = re.sub(r'^[□○●•▶▷※\-]+', '', line).strip()
        if re.match(r'.+:', line):
            result.append(line.rstrip('.') + '.')
        else:
            result.append("또는 " + line.rstrip('.') + '.')
    return " ".join(result)

# zipCd → 지역명 리스트
def zip_to_region_names(zip_codes: str) -> list:
    codes = zip_codes.split(",")
    return list({zip_to_region.get(code.strip()) for code in codes if zip_to_region.get(code.strip())})

# 최종 임베딩 문서 생성
def regenerate_embedding_text(data: dict) -> dict:
    title = data.get("plcyNm", "")
    keyword = data.get("plcyKywdNm", "")
    expl = data.get("plcyExplnCn", "")
    lclass = data.get("lclsfNm", "")
    mclass = data.get("mclsfNm", "")
    support = normalize_text(data.get("plcySprtCn", ""))
    org = data.get("sprvsnInstCdNm", "")
    start = data.get("bizPrdBgngYmd", "")
    end = data.get("bizPrdEndYmd", "")
    apply_info = normalize_text(data.get("plcyAplyMthdCn", ""))
    screening = normalize_text(data.get("srngMthdCn", ""))
    submit_docs = normalize_text(data.get("sbmsnDcmntCn", ""))
    ref_url = data.get("refUrlAddr1", "")
    support_scale = data.get("sprtSclCnt", "")
    min_age = data.get("sprtTrgtMinAge")
    max_age = data.get("sprtTrgtMaxAge")
    age = f"만 {min_age}세 ~ {max_age}세" if min_age and max_age else ""
    income = data.get("earnEtcCn", "").lstrip("-").strip()
    reg_org = data.get("rgtrInstCdNm", "")
    apply_url = data.get("aplyUrlAddr", "")
    apply_period = data.get("aplyYmd", "")
    region_list = zip_to_region_names(data.get("zipCd", ""))
    region = "정책 적용 지역: " + ", ".join(region_list) + "." if region_list else ""

    sentences = [
        f"{title}은(는) {reg_org}에서 시행하는 정책입니다.",
        f"정책 키워드: {keyword}." if keyword else "",
        f"정책 분류: {lclass}, {mclass}." if lclass or mclass else "",
        expl,
        f"주관 기관: {org}." if org else "",
        f"지원 대상 연령은 {age}입니다." if age else "",
        f"소득 조건: {income}." if income else "",
        f"지원 규모: {support_scale}명." if support_scale else "",
        support,
        apply_info,
        screening,
        submit_docs,
        region,
        f"신청 기간은 {apply_period}입니다." if apply_period else "",
        f"사업 기간은 {start}부터 {end}까지입니다." if start and end else "",
        f"신청 링크: {apply_url}." if apply_url else "",
        f"참고 링크: {ref_url}." if ref_url else ""
    ]

    return {
        "plcyNo": data.get("plcyNo"),
        "title": title,
        "keyword": keyword,
        "description": expl,
        "category_large": lclass,
        "category_medium": mclass,
        "support_content": support,
        "organization": org,
        "start_date": start,
        "end_date": end,
        "application_info": apply_info,
        "screening_method": screening,
        "submission_documents": submit_docs,
        "ref_url": ref_url,
        "support_scale": support_scale,
        "age_range": age,
        "income_condition": income,
        "registration_org": reg_org,
        "apply_url": apply_url,
        "apply_period": apply_period,
        "region": region_list,
        "embedding_text": " ".join(s for s in sentences if s)
    }

# DB 접속
def get_mongo_client():
    return MongoClient(MONGO_URI)

# 실행 메서드
def update_processed_policies():
    client = get_mongo_client()
    raw_col = client["youth_policies"]["seoul_policies"]
    processed_col = client["youth_policies"]["processed_policies"]

    existing_ids = set(doc["plcyNo"] for doc in processed_col.find({}, {"plcyNo": 1}))
    inserted_count = 0

    for doc in raw_col.find():
        plcy_no = doc.get("plcyNo")
        if not plcy_no or plcy_no in existing_ids:
            continue

        processed = regenerate_embedding_text(doc)
        processed_col.insert_one(processed)
        inserted_count += 1

    print(f"{inserted_count}건 정제되어 processed_policies에 저장됨.")
