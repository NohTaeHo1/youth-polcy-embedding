from typing import Dict

ESSENTIAL_FIELDS_MAP = {
    "_id": None,
    "plcyNo": "plcyNo",
    "plcyNm": "plcyNm",
    "plcyKywdNm": "plcyKywdNm",
    "plcyExplnCn": "plcyExplnCn",
    "clsfNm": ["lclsfNm", "mclsfNm"],
    "plcySprtCn": "plcySprtCn",
    "sprvsnInstCdNm": "sprvsnInstCdNm",
    "operInstCdNm": "operInstCdNm",
    "sprtTrgtMinAge": "sprtTrgtMinAge",
    "sprtTrgtMaxAge": "sprtTrgtMaxAge",
    "earnMinAmt": "earnMinAmt",
    "earnMaxAmt": "earnMaxAmt",
    "earnEtcCn": "earnEtcCn",
    "zipCd": "zipCd",
    "aplyYmd": "aplyYmd",
    "aplyUrlAddr": "aplyUrlAddr",
    "refUrlAddr1": "refUrlAddr1",
    "refUrlAddr2": "refUrlAddr2",
    "plcyAplyMthdCn": "plcyAplyMthdCn",
    "srngMthdCn": "srngMthdCn",
    "etcMttrCn": "etcMttrCn",
    "addAplyQlfcCndCn": "addAplyQlfcCndCn",
    "sbmsnDcmntCn": "sbmsnDcmntCn",
    "ptcpPrpTrgtCn": "ptcpPrpTrgtCn",
    "sprtArvlSeqYn": "sprtArvlSeqYn",
    "sprtSclCnt": "sprtSclCnt",
    "lastMdfcnDt": "lastMdfcnDt"
}



def extract_raw_fields(raw_doc: Dict) -> Dict:
    """
    원본 raw_doc에서 필요한 필드만 추출하여 반환
    - clsfNm은 대분류/중분류 합쳐서 raw로 제공
    """
    extracted = {}

    for new_key, original in ESSENTIAL_FIELDS_MAP.items():
        if new_key == "clsfNm":
            l = raw_doc.get("lclsfNm", "")
            m = raw_doc.get("mclsfNm", "")
            extracted[new_key] = [l, m]
        elif original is None:
            extracted[new_key] = raw_doc.get(new_key)
        else:
            extracted[new_key] = raw_doc.get(original)

    return extracted
