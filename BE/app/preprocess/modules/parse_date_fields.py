import re
from datetime import datetime
from typing import Optional, Tuple, List


def parse_date_string_to_iso(date_str: str) -> Optional[str]:
    """
    날짜 문자열을 ISO 포맷 문자열('%Y-%m-%d')로 변환
    허용 형식: 'YYYYMMDD', 'YYYY-MM-DD', 'YYYY.MM.DD'
    실패 시 None 반환
    """
    if not date_str or not isinstance(date_str, str):
        return None

    date_str = date_str.strip()
    formats = ["%Y%m%d", "%Y-%m-%d", "%Y.%m.%d"]

    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue

    return None


def parse_application_period(aply_ymd: Optional[str]) -> List[Optional[str]]:
    """
    신청 기간 문자열 파싱
    - '상시', '연중' 등은 ['상시', None, None]
    - '2024.05.01 ~ 2024.06.30' → ['기간', '2024-05-01', '2024-06-30']
    - 형식 불명확할 경우 [None, None, None]
    """
    if not aply_ymd or not isinstance(aply_ymd, str):
        return [None, None, None]

    aply_ymd = aply_ymd.strip()

    # 상시성 여부
    if any(token in aply_ymd for token in ["상시", "연중", "수시"]):
        return ["상시", None, None]

    # 날짜 범위 파싱
    date_pattern = r'(\d{4}[.\-]?\d{2}[.\-]?\d{2})\s*~\s*(\d{4}[.\-]?\d{2}[.\-]?\d{2})'
    match = re.match(date_pattern, aply_ymd)

    if match:
        start = parse_date_string_to_iso(match.group(1))
        end = parse_date_string_to_iso(match.group(2))
        return ["기간", start, end]

    return [None, None, None]
