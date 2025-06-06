import requests
from app.config import ONTO_API_KEY
import certifi
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def fetch_all_policies(max_pages=500, page_size=100):
    """
    온통청년 정책 전체 페이지를 순회하며 데이터를 수집

    Args:
        max_pages (int): 최대 몇 페이지까지 반복할지 설정
        page_size (int): 페이지당 항목 수

    Returns:
        list: 모든 페이지에서 수집된 정책 리스트
    """
    all_policies = []

    for page_num in range(1, max_pages + 1):
        url = "https://www.youthcenter.go.kr/go/ythip/getPlcy"
        payload = {
            "apiKeyNm": ONTO_API_KEY,
            "pageNum": page_num,
            "pageSize": page_size,
            "pageType": "1"
        }

        try:
            # 인증서 오류로 'verify=False' 해놓음음
            response = requests.get(url, params=payload, timeout=10, verify=False)
            response.raise_for_status()
            data = response.json()

            items = data.get("result", {}).get("youthPolicyList", [])


            if not items:
                break  # 더 이상 데이터가 없으면 종료

            all_policies.extend(items)

        except Exception as e:
            print(f"{page_num}페이지 API 요청 실패: {e}")
            break

    return all_policies