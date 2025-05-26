from app.preprocess.modules.normalize_text import normalize_policy_text, clean_text
from app.preprocess.modules.parse_list_fields import split_keywords, combine_classification_fields
from app.preprocess.modules.parse_date_fields import parse_application_period
from app.preprocess.modules.parse_zip_code import zip_code_to_district_name


def process_fields(extracted: dict) -> dict:
    processed = {}

    processed["_id"] = extracted.get("_id")
    processed["plcyNo"] = extracted.get("plcyNo")
    processed["plcyNm"] = normalize_policy_text(extracted.get("plcyNm", ""))
    processed["plcyKywdNm"] = split_keywords(extracted.get("plcyKywdNm", ""))
    processed["plcyExplnCn"] = normalize_policy_text(extracted.get("plcyExplnCn", ""))
    clsf_nm_values = extracted.get("clsfNm")  # "clsfNm" 키는 [l값, m값] 형태의 리스트를 가짐
    if isinstance(clsf_nm_values, list) and len(clsf_nm_values) == 2:
        processed["clsfNm"] = combine_classification_fields(
            clsf_nm_values[0], clsf_nm_values[1]
        )
    else:
        # clsf_nm_values가 예상대로 리스트가 아니거나 요소가 2개가 아닌 경우의 처리
        # combine_classification_fields 함수가 None 또는 빈 문자열을 처리할 수 있다고 가정
        l_val = clsf_nm_values[0] if isinstance(clsf_nm_values, list) and len(clsf_nm_values) > 0 else ""
        m_val = clsf_nm_values[1] if isinstance(clsf_nm_values, list) and len(clsf_nm_values) > 1 else ""
        processed["clsfNm"] = combine_classification_fields(l_val, m_val)
    processed["plcySprtCn"] = normalize_policy_text(extracted.get("plcySprtCn", ""))

    processed["sprvsnInstCdNm"] = clean_text(extracted.get("sprvsnInstCdNm", ""))
    processed["operInstCdNm"] = clean_text(extracted.get("operInstCdNm", ""))

    processed["sprtTrgtMinAge"] = clean_text(extracted.get("sprtTrgtMinAge", ""))
    processed["sprtTrgtMaxAge"] = clean_text(extracted.get("sprtTrgtMaxAge", ""))
    processed["earnMinAmt"] = clean_text(extracted.get("earnMinAmt", ""))
    processed["earnMaxAmt"] = clean_text(extracted.get("earnMaxAmt", ""))
    processed["earnEtcCn"] = normalize_policy_text(extracted.get("earnEtcCn", ""))

    zip_code_cleaned = str(extracted.get("zipCd", "")).strip()
    processed["zipNm"] = zip_code_to_district_name(zip_code_cleaned)
    processed["aplyYmd"] = parse_application_period(extracted.get("aplyYmd")) #

    processed["plcyAplyMthdCn"] = normalize_policy_text(extracted.get("plcyAplyMthdCn", ""))
    processed["srngMthdCn"] = normalize_policy_text(extracted.get("srngMthdCn", ""))
    processed["etcMttrCn"] = normalize_policy_text(extracted.get("etcMttrCn", ""))
    processed["addAplyQlfcCndCn"] = normalize_policy_text(extracted.get("addAplyQlfcCndCn", ""))
    processed["ptcpPrpTrgtCn"] = normalize_policy_text(extracted.get("ptcpPrpTrgtCn", ""))

    processed["aplyUrlAddr"] = clean_text(extracted.get("aplyUrlAddr", ""))
    processed["refUrlAddr1"] = clean_text(extracted.get("refUrlAddr1", ""))
    processed["refUrlAddr2"] = clean_text(extracted.get("refUrlAddr2", ""))

    processed["sprtArvlSeqYn"] = extracted.get("sprtArvlSeqYn")
    processed["sprtSclCnt"] = clean_text(extracted.get("sprtSclCnt", ""))
    processed["lastMdfcnDt"] = clean_text(extracted.get("lastMdfcnDt", ""))

    return processed
