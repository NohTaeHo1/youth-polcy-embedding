# 청정큐레이터: 청년정책 임베딩 파이프라인 (2025년 6월 1일 기준)

## 개요
서울시 청년정책 데이터를 수집, 정제, 가공하여 사용자 맞춤형 정책 추천을 위한 **벡터 임베딩을 생성하는 자동화 파이프라인**입니다. 데이터는 MongoDB에서 단계별로 처리되며, 최종적으로 `embedding_text`를 외부 임베딩 서버에 전송 후 Pinecone DB에 저장합니다.  
전체 과정은 FastAPI 기반으로 자동화 및 스케줄링됩니다.

---

## 주요 모듈 구성

| 모듈 | 설명 |
|------|------|
| `config.py` | .env로부터 MongoDB URI, API 키(Pinecone 등) 로드 |
| `main.py` | FastAPI 서버 및 APScheduler 기반 파이프라인 스케줄링 |
| `pipeline_orchestrator.py` | 전체 파이프라인 실행 흐름 제어 (`run_full_pipeline`) |
| `youth_policy_api.py` | 온통청년 API를 통한 정책 데이터 수집 |
| `mongodb.py` | MongoDB와의 인터페이스: 저장, 필터링, 조회 등 |
| `field_selector.py` | origin_db에서 주요 필드 선별 및 clsfNm 통합 리스트 생성 |
| `field_processor.py` | 선별된 필드 정제 (텍스트, 리스트, 날짜 등) |
| `normalize_text.py` | 텍스트 정제 및 자연어화 규칙 적용 |
| `parse_list_fields.py` | 정책 키워드 및 분류 필드 리스트화 |
| `parse_date_fields.py` | 신청기간 필드의 구조화 처리 |
| `parse_zip_code.py` | zipCd → zipNm(자치구) 매핑 |
| `extract_detail.py` | origin_db → detail_db 전처리 파이프라인 |
| `extract_metadata.py` | detail_db → metadata_db 필드 축소 파이프라인 |
| `embedding_runner.py` | metadata_db → embedding_text 생성 및 임베딩 수행 |
| `pinecone.py` | Pinecone 연결 및 벡터 업서트 |
| `llm_utils.py` | (옵션) Ollama LLM 통신 유틸리티 |

---

## 처리 흐름

| 단계 | 실행 주체 | 설명 |
|------|------------|------|
| 1단계 | `youth_policy_api.py` | (선택) 정책 수집 (온통청년 API) |
| 2단계 | `mongodb.py`<br>DB: `origin_db` | 서울 정책 필터링 및 중복 제거 후 저장 |
| 3단계 | `extract_detail.py`<br>DB: `detail_db` | 주요 필드 정제 및 구조화 |
| 4단계 | `extract_metadata.py`<br>DB: `metadata_db` | embedding_text 생성을 위한 필드 축소 |
| 5단계 | `embedding_runner.py` | metadata 문서 로드 및 embedding_text 생성 |
| 6단계 | `convert_dict_to_string` | 필드를 자연어 문장으로 변환 |
| 7단계 | `/embed` 서버 호출 | 로컬 임베딩 서버에 embedding_text 전송 |
| 8단계 | `pinecone.insert_*` | 신규 벡터 Pinecone에 업서트 |
| 9단계 | `main.py` + APScheduler | 서버 시작 시 및 매일 자동 실행 |

---

## 임베딩 전략 (`embedding_runner.py`)

### 필드 조합
`FIELD_KO_MAP`에 정의된 필드 기준:
- `plcyNm`, `plcyKywdNm`, `clsfNm`, `sprvsnInstCdNm`
- `sprtTrgtMinAge`, `sprtTrgtMaxAge`, `aplyYmd`, `sprtArvlSeqYn`
- `sprtSclCnt`, `zipNm`

### 문장 생성 로직
- 각 필드는 `"레이블은/는 값입니다."` 형태로 변환
- 날짜 및 선착순 여부는 별도 포맷터 (`format_aplyYmd`, `format_sprtArvlSeqYn`) 사용
- 리스트 값은 쉼표로 연결

**예시**:  
`정책명은 청년희망적금입니다. 정책키워드는 취업, 금융입니다. 신청 기간은 2025년 1월 1일부터 12월 31일까지입니다.`

---

## 전처리 규칙 요약

| 항목 | 규칙 |
|------|------|
| 특수문자 제거 | ○, ●, ▷ 등 제거 |
| HTML 제거 | `<tag>` 제거 |
| 법인격 제거 | (주), ㈜ 등 제거 |
| 콜론 문장화 | `"제목: 내용"` → `"제목은 내용입니다."` |
| 날짜/시간 변환 | `"HH:MM"` → `"HH시 MM분"` |
| 마침표 보정 | 문장 종결 보장, 연속 마침표 제거 |
| 패턴 보호/복원 | URL, 전화번호 등 플레이스홀더 처리 후 복원 |
| 줄바꿈 정리 | 여러 줄 → 단일 문단 |

---

## 파서 처리 규칙

- `parse_zip_code.py`:  
  `zipCd` → `zipNm` (서울 자치구 이름 리스트)

- `parse_date_fields.py`:  
  - `상시` 등 → `["상시", None, None]`  
  - 날짜 범위 → `["기간", "YYYY-MM-DD", "YYYY-MM-DD"]`

- `parse_list_fields.py`:  
  - 쉼표/공백 분리, 중복 제거, 정렬  
  - `lclsfNm` + `mclsfNm` → `clsfNm` 병합

---

## 향후 과제

- `FIELD_KO_MAP` 문장 구성 방식 고도화
- 모델 변경 시 embedding_text 생성 최적화
- Pinecone 인덱스 구조 및 검색 성능 개선

---

## 참고사항

- Python 패키지: `environment.yml` 참조
- 민감정보: `.env`로 분리 관리
- 쿼리 테스트 도구: Compass, mongo shell, `policy_check.mongodb.js`
- `/embed` 서버가 사전 실행되어 있어야 전체 파이프라인 정상 작동
