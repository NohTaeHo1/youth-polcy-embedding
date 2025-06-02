from sentence_transformers import SentenceTransformer
from typing import List, Union, Dict
import numpy as np

class SentenceTransformerEmbedder:
    def __init__(self, model_name: str = "BAAI/bge-m3"):
        self.model = SentenceTransformer(model_name)

    def get_embedding(self, text: str) -> List[float]:
        """
        단일 텍스트의 임베딩 벡터를 리스트로 반환
        """
        if not isinstance(text, str) or not text.strip():
            raise ValueError("텍스트가 유효하지 않습니다.")
        try:
            embedding = self.model.encode([text], show_progress_bar=False)[0]
            return embedding.tolist()  # numpy array를 list로 변환
        except Exception as e:
            raise ValueError(f"임베딩 생성 실패: {str(e)}")



#----# youth-policy 데이터의 Pinecone 인덱스에 저장된 데이터를 확인하는 스크립트
# import os
# from pinecone import Pinecone

# # Pinecone 클라이언트 초기화
# pc = Pinecone(
#     api_key=os.environ.get("PINECONE_API_KEY")
# )

# def check_pinecone_data():
#     """Pinecone 데이터 확인"""
#     # 사용 가능한 인덱스 목록 확인
#     indexes = pc.list_indexes()
#     print(f"사용 가능한 인덱스: {indexes.names()}")
    
#     # 특정 인덱스가 있다면 데이터 확인
#     if 'youth-policies-index' in indexes.names():  # 실제 인덱스 이름으로 변경 필요
#         index = pc.Index('youth-policies-index')
#         stats = index.describe_index_stats()
#         print(f"인덱스 통계: {stats}")
        
#         # 샘플 데이터 조회
#         query_result = index.query(
#             vector=[0]*1024,
#             top_k=1,
#             include_metadata=True
#         )
#         print(f"샘플 데이터: {query_result}")
#     else:
#         print("youth-policy 인덱스를 찾을 수 없습니다.")

# if __name__ == "__main__":
#     check_pinecone_data()