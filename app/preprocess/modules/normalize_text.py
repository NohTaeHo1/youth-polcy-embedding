import re
import uuid

PROTECTED_PATTERNS_CONFIG = {
    "URL": r'https?://[^\s<>"\']+|www\.[^\s<>"\']+',
    "DATETIME_FULL_RANGE": r'\d{4}\s*[.\년]\s*\d{1,2}\s*[\.\월]\s*\d{1,2}\s*[\일]?\s*\(?\w\)?\s*\d{1,2}\s*:\s*\d{2}\s*~\s*\d{1,2}\s*:\s*\d{2}',
    "DATETIME_SIMPLE": r'\d{4}\s*[.\-]\s*\d{1,2}\s*[.\-]\s*\d{1,2}\s+\d{1,2}\s*:\s*\d{1,2}(?:\s*:\s*\d{1,2})?',
    "DATE_FULL_DETAIL": r'\d{4}\s*[.\년]\s*\d{1,2}\s*[\.\월]\s*\d{1,2}\s*[\일]?\s*\(?\w\)?',
    "DATE_FULL": r'\d{4}\s*[.\년]\s*\d{1,2}\s*[\.\월]\s*\d{1,2}\s*[\일]?',
    "TIME_RANGE": r'\d{1,2}\s*:\s*\d{2}\s*~\s*\d{1,2}\s*:\s*\d{2}',
    "TIME_SIMPLE": r'\b\d{1,2}\s*:\s*\d{2}\b',
    "TEL": r'\(?\d{2,4}\)?\s*[\-\.]?\s*\d{3,4}\s*[\-\.]?\s*\d{4}',
    "EMAIL": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
}

def _generate_placeholder(tag: str) -> str:
    return f"__{tag}_{uuid.uuid4().hex[:8]}__"

def protect_patterns(text: str) -> tuple[str, dict[str, str]]:
    placeholders_map = {}
    for tag, pattern in PROTECTED_PATTERNS_CONFIG.items():
        def replace_match(match):
            original_text = match.group(0)
            if original_text.startswith("__") and original_text.endswith("__") and \
               any(f"__{t}_" in original_text for t in PROTECTED_PATTERNS_CONFIG.keys()):
                return original_text
            placeholder = _generate_placeholder(tag)
            placeholders_map[placeholder] = original_text
            return placeholder
        try:
            text = re.sub(pattern, replace_match, text)
        except re.error as e:
            print(f"Warning: Regex error for pattern TAG='{tag}', PATTERN='{pattern}'. Error: {e}")
            pass
    return text, placeholders_map

def restore_patterns(text: str, placeholders_map: dict[str, str]) -> str:
    for placeholder, original_text in placeholders_map.items():
        text = text.replace(placeholder, original_text)
    return text

def _get_eun_neun(word: str) -> str:
    if not word: return "는" 
    last_char = word[-1]
    if '가' <= last_char <= '힣':
        if (ord(last_char) - ord('가')) % 28 > 0: return "은"
        else: return "는"
    return "는" 

def _convert_arrow_path_to_sentence(path_segment: str, action_verb: str = "확인할 수 있습니다") -> str:
    standardized_path = re.sub(r'\s*(?:→|->|>)\s*', '>', path_segment.strip())
    items = [item.strip() for item in standardized_path.split('>') if item.strip()]
    if not items: return path_segment
    count = len(items)
    if count == 1: return f"{items[0]}에서 {action_verb}."
    if count == 2: return f"{items[0]}의 ‘{items[1]}’에서 {action_verb}."
    if count >= 3:
        first_element = items[0]; last_element = items[-1]
        path_description = f"{first_element}의 ‘{items[1]}’"
        for i in range(2, count - 1): path_description += f"를 거쳐 ‘{items[i]}’"
        path_description += f"를 거쳐 ‘{last_element}’에서 {action_verb}."
        return path_description
    return path_segment

def normalize_policy_text(text: str) -> str:
    if not text or not isinstance(text, str): return ""

    text = text.replace("문 의", "문의")
    text, placeholders_map = protect_patterns(text)

    lines = text.splitlines()
    processed_lines = []
    for current_line_text in lines:
        line = current_line_text.strip()
        if not line: continue

        # 사용자 정의 콜론 규칙 적용: "Header : Details" -> "Header은/는 Details"
        # 이 규칙은 플레이스홀더가 아닌 부분에만 적용되어야 함.
        # 콜론이 있는 라인에 대해 우선적으로 이 변환 시도.
        # 정규식으로 콜론 앞/뒤를 나누고, 앞부분에 조사 붙여 합침.
        # (주의: 이 콜론 변환이 다른 콜론 사용(예: 시간)과 충돌하지 않도록,
        #  또는 이 작업이 플레이스홀더 처리된 텍스트에 안전하게 적용되도록 해야함.
        #  현재는 protect_patterns 이후이므로, 시간 내의 콜론은 보호됨)
        
        # 콜론 앞뒤로 공백이 유연하게 있고, 콜론 자체가 플레이스더의 일부가 아닌 경우를 가정.
        # 간단한 접근: 라인 전체에 대해 콜론이 하나 있고, 그것이 구분자 역할을 할 때.
        parts_for_colon_rule = []
        temp_text_for_colon_rule = line
        # 플레이스홀더 기준으로 먼저 나누고, 각 부분 문자열에 콜론 규칙 적용
        split_by_placeholders = re.split(r'(__[A-Z0-9_]+__)', temp_text_for_colon_rule)
        
        for i, segment in enumerate(split_by_placeholders):
            if segment.startswith("__") and segment.endswith("__") and \
               any(f"__{tag}_" in segment for tag in PROTECTED_PATTERNS_CONFIG.keys()):
                parts_for_colon_rule.append(segment) # 플레이스홀더는 그대로 유지
            else:
                # 플레이스홀더가 아닌 세그먼트에 대해 콜론 규칙 적용
                # 여기서 콜론은 하나만 있다고 가정하고, 첫번째 콜론만 처리.
                colon_match = re.match(r'^(.*?)\s*:\s*(.*)$', segment)
                if colon_match:
                    header_candidate = colon_match.group(1).strip()
                    details_after_colon = colon_match.group(2).strip()
                    if header_candidate: # 헤더가 비어있지 않으면
                        particle = _get_eun_neun(header_candidate)
                        parts_for_colon_rule.append(f"{header_candidate}{particle} {details_after_colon}")
                    else: # 콜론 앞에 내용이 없으면 (예: ": 내용") 그냥 원래대로 두거나 ". 내용" 처리
                        parts_for_colon_rule.append(f". {details_after_colon}" if details_after_colon else ".")
                else:
                    parts_for_colon_rule.append(segment) # 콜론 없으면 그대로
        line = "".join(parts_for_colon_rule)

        # 리스트 마커 제거 및 알려진 섹션 제목 제거 (위 콜론 규칙으로 변형 안 된 경우)
        line = re.sub(r'^[\-•○●▶▷□ㅇ]+\s*', '', line)
        line = re.sub(r'^(지원내용|사업 내용|활동내용|상담내용|교육내용|교육일정|신청방법|제출서류|추진근거|문의)\s*[:.]?\s*',
                      '', line, flags=re.IGNORECASE)
        
        if line:
            processed_lines.append(line)

    # 줄바꿈 규칙 적용하며 라인 결합
    # "앞의 문자가 .이나 공백이 아닌 경우 .으로 변환" (정확히는 . 과 공백 추가)
    if not processed_lines: # 모든 라인이 비어있거나, 입력 자체가 비어있었으면
        text = ""
    else:
        text_builder = [processed_lines[0]]
        for i in range(1, len(processed_lines)):
            prev_line = processed_lines[i-1]
            current_line = processed_lines[i]
            if prev_line and not prev_line.endswith(('.', ' ', '?', '!')):
                text_builder.append('.') # 마침표 추가
            text_builder.append(' ') # 항상 공백 추가로 문장/항목 구분
            text_builder.append(current_line)
        text = "".join(text_builder)

    # 경로 기호 표준화 및 자연어 변환
    text = re.sub(r'\s*→\s*', ' > ', text)
    text = re.sub(r'\s*->\s*', ' > ', text)
    text = re.sub(r'\s*>\s*', ' > ', text)
    
    path_regex_for_conversion = r'((?:(?:[^\s>]+(?:\s+[^\s>]+)*))\s*(?:>\s*(?:(?:[^\s>]+(?:\s+[^\s>]+)*))\s*)+)'
    if re.search(r'\s>\s', text):
        try:
            text = re.sub(path_regex_for_conversion, 
                          lambda m: _convert_arrow_path_to_sentence(m.group(0), action_verb="확인할 수 있습니다"), 
                          text)
        except re.error as e:
            print(f"Warning: Regex error during path conversion. PATTERN='{path_regex_for_conversion}'. Error: {e}")

    text = text.replace('…', '...')
    text = re.sub(r'\.{2,}', '.', text)

    # 여기서 일반 콜론 처리는 이미 위에서 라인별로 진행했으므로, 추가적인 일반 콜론 변경은 필요 없을 수 있음.
    # 만약 라인별 콜론 규칙에서 처리 안된 콜론이 있다면, 그것은 의도적으로 남겨진 것일 수 있음 (플레이스홀더 내부 등)
    # 또는, 모든 종류의 콜론을 최종적으로 마침표로 바꾸고 싶다면 여기서 다시 처리.
    # 현재는 위에서 : -> 은/는 변환이 주 목적이므로, 남은 콜론은 그대로 두거나, 필요시 여기서 . 으로 변경.

    text = re.sub(r'[「」『』【】㈜㈔<>]', '', text)
    text = text.replace('(주)', '').replace('(사)', '')
    text = re.sub(r'[□○●•◉►▼▸▷※◇◆★☆✓▪✔·ㆍ]', '', text)
    text = re.sub(r'(^|([.?!]\s+))\s*([0-9]+\s*\.|[ㄱ-ㅎ가-힣]\s*\.)\s*', r'\1', text)
    text = re.sub(r'\.{2,}', '.', text)

    text = restore_patterns(text, placeholders_map)

    text = re.sub(r'(\d{1,2})\s*:\s*(\d{2})\s*~\s*(\d{1,2})\s*:\s*(\d{2})',
                  r'\1시 \2분부터 \3시 \4분까지', text)
    text = re.sub(r'\s*~\s*', '부터 ', text)
    text = re.sub(r'\.{2,}', '.', text)

    # 최종 문장 분리 및 재구성 (이중 마침표 문제 해결 로직)
    sentences_raw = re.split(r'(?<=[.?!])\s+', text)
    processed_sentences = []
    for s_raw in sentences_raw:
        s_cleaned = re.sub(r'-\s*$', '', s_raw).strip()
        if s_cleaned:
            if len(s_cleaned) > 0 and s_cleaned[-1] in '.?!':
                s_cleaned = s_cleaned[:-1].strip()
            if s_cleaned: # 구두점 제거 후에도 내용이 있으면 추가
                processed_sentences.append(s_cleaned)
    
    result = ""
    if processed_sentences:
        result = '. '.join(filter(None, processed_sentences)) # 빈 문자열 확실히 제외
        if result and not result.endswith(('.', '?', '!')):
            result += '.'
    
    result = re.sub(r'\s{2,}', ' ', result).strip()
    result = result.replace(' .', '.').replace(' ?', '?').replace(' !', '!')
    result = re.sub(r'\.\s*\.', '.', result) 
    result = re.sub(r'\.{2,}', '.', result)

    return result

def clean_text(text: str) -> str:
    if not text or not isinstance(text, str): return ""
    return re.sub(r'\s+', ' ', text.strip())