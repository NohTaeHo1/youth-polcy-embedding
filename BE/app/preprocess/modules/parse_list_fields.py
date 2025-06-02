import re
from typing import List, Optional

CONNECTING_WORDS_TO_REMOVE = {"및", "그리고", "또는", "과", "와"}

def split_keywords(keyword_raw: Optional[str]) -> List[str]:
    """
    정책 키워드 문자열을 리스트로 분리하고 정제
    - 입력: "금융, 복지 ,일자리"
    - 출력: ["금융", "복지", "일자리"]
    """
    if not keyword_raw or not isinstance(keyword_raw, str):
        return []
    keywords = re.split(r'[,\s]+', keyword_raw)
    return sorted(list({kw.strip() for kw in keywords if kw.strip()}))


def combine_classification_fields(lclass: Optional[str], mclass: Optional[str]) -> List[str]:
    """
    대분류 + 중분류를 합쳐 하나의 리스트로 반환
    - 중복 제거, 정렬 및 지정된 연결어 제거
    - 입력: "복지문화", "취약계층 및 금융지원"
    - 출력 (수정 후 예상): ["금융지원", "복지문화", "취약계층"]
    """
    items = []
    for cls_string in (lclass, mclass): # 변수명을 cls에서 cls_string으로 변경하여 명확성 증진
        if cls_string and isinstance(cls_string, str):
            # 1. 쉼표 또는 공백 기준으로 문자열 분리
            raw_parts = [p.strip() for p in re.split(r'[,\s]+', cls_string) if p.strip()]
            
            # 2. 정의된 연결어 목록에 없는 단어들만 필터링
            filtered_parts = [part for part in raw_parts if part not in CONNECTING_WORDS_TO_REMOVE]
            
            items.extend(filtered_parts)
            
    # 3. 최종적으로 중복 제거 및 정렬
    return sorted(list(set(items)))
