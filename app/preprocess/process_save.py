from pymongo import MongoClient
import re
from app.config import MONGO_URI

zip_to_region = {
    "11110": "서울시 종로구", "11140": "서울시 중구", "11170": "서울시 용산구",
    "11200": "서울시 성동구", "11215": "서울시 광진구",
    "11230": "서울시 동대문구", "11260": "서울시 중랑구", "11290": "서울시 성북구",
    "11305": "서울시 강북구", "11320": "서울시 도봉구", "11350": "서울시 노원구",
    "11380": "서울시 은평구", "11410": "서울시 서대문구", "11440": "서울시 마포구",
    "11470": "서울시 양천구", "11500": "서울시 강서구", "11530": "서울시 구로구",
    "11545": "서울시 금천구", "11560": "서울시 영등포구", "11590": "서울시 동작구",
    "11620": "서울시 관악구", "11650": "서울시 서초구", "11680": "서울시 강남구",
    "11710": "서울시 송파구", "11740": "서울시 강동구"
}

def clean_tilde(text: str) -> str:
    return re.sub(r'\s*~\s*', '부터 ', text)

def normalize_newlines(text: str) -> str:
    text = re.sub(r'(?<!\.)\n', '. ', text) 
    text = text.replace('\n', ' ')  # 남은 \n 제거
    return text

def normalize_text(raw: str) -> str:
    raw = clean_tilde(raw)
    raw = normalize_newlines(raw)
    lines = raw.splitlines()
    result = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        line = re.sub(r'^[□○●•▶▷※\-]+', '', line).strip()
        line = re.sub(r':\s*$', '', line)
        result.append(line.rstrip('.'))
    return ". ".join(result) + '.' if result else ""

def dedup_and_sort(text: str) -> str:
    return ", ".join(sorted(set(x.strip() for x in text.split(",") if x.strip())))

def zip_to_region_names(zip_codes: str) -> list:
    codes = zip_codes.split(",")
    return list({zip_to_region.get(code.strip()) for code in codes if zip_to_region.get(code.strip())})

def regenerate_embedding_text(data: dict) -> dict:
    title = data.get("plcyNm", "")
    keyword = data.get("plcyKywdNm", "")
    expl = data.get("plcyExplnCn", "")
    lclass = dedup_and_sort(data.get("lclsfNm", ""))
    mclass = dedup_and_sort(data.get("mclsfNm", ""))
    support = normalize_text(clean_tilde(data.get("plcySprtCn", "")))
    org = data.get("sprvsnInstCdNm", "")
    start = data.get("bizPrdBgngYmd", "")
    end = data.get("bizPrdEndYmd", "")
    apply_info = normalize_text(clean_tilde(data.get("plcyAplyMthdCn", "")))
    screening = normalize_text(clean_tilde(data.get("srngMthdCn", "")))
    submit_docs = normalize_text(clean_tilde(data.get("sbmsnDcmntCn", "")))
    ref_url = data.get("refUrlAddr1", "")
    support_scale = data.get("sprtSclCnt", "")
    min_age = data.get("sprtTrgtMinAge")
    max_age = data.get("sprtTrgtMaxAge")
    age = f"만 {min_age}세부터 {max_age}세까지" if min_age and max_age else ""
    income = data.get("earnEtcCn", "").lstrip("-").strip()
    reg_org = data.get("rgtrInstCdNm", "")
    apply_url = data.get("aplyUrlAddr", "")
    apply_period = clean_tilde(data.get("aplyYmd", ""))
    region_list = zip_to_region_names(data.get("zipCd", ""))

    if not region_list and reg_org.startswith("서울특별시 ") and reg_org.endswith("구"):
        region_list = [reg_org]

    sentences = []
    sentences.append(f"'{title}' 정책은 {reg_org}에서 시행합니다.")
    if keyword:
        sentences.append(f"이 정책은 '{keyword}'와 관련된 내용입니다.")
    if lclass or mclass:
        sentences.append(f"정책은 '{lclass}' 및 '{mclass}' 분야로 분류됩니다.")
    if expl.strip() and support.strip() and expl.strip() != support.strip():
        sentences.append(f"정책의 주요 내용은 다음과 같습니다. {expl}")
        sentences.append(f"지원 내용은 다음과 같습니다. {support}")
    elif support and not expl:
        sentences.append(f"지원 내용은 다음과 같습니다. {support}")
    elif expl:
        sentences.append(f"정책의 주요 내용은 다음과 같습니다. {expl}")
    if org:
        sentences.append(f"주관 기관은 {org}입니다.")
    if age:
        sentences.append(f"지원 대상 연령은 {age}입니다.")
    if income:
        sentences.append(f"소득 조건은 '{income}'입니다.")
    if support_scale:
        sentences.append(f"총 {support_scale}명을 지원할 예정입니다.")
    if apply_info:
        sentences.append(f"신청 방법은 다음과 같습니다. {apply_info}")
    if screening:
        sentences.append(f"선정 방식은 다음과 같습니다. {screening}")
    if submit_docs:
        sentences.append(f"제출 서류는 다음과 같습니다. {submit_docs}")
    if region_list:
        sentences.append(f"정책 적용 지역은 {', '.join(region_list)}입니다.")
    if apply_period:
        sentences.append(f"신청 기간은 {apply_period}입니다.")
    if start and end:
        sentences.append(f"사업 기간은 {start}부터 {end}까지입니다.")
    if apply_url:
        sentences.append(f"신청은 다음 링크를 통해 가능합니다. {apply_url}")
    if ref_url:
        sentences.append(f"더 자세한 내용은 다음의 링크를 참조하세요. {ref_url}")

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
        "embedding_text": normalize_newlines(" ".join(sentences))
    }

def get_mongo_client():
    return MongoClient(MONGO_URI)

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