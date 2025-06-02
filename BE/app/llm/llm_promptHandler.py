class promptHandler:
        """
        RAG (Retrieval-Augmented Generation) Vector DB에서 가장 유사한 데이터를 불러들여옴.
        
        불러 들여온 데이터를 프롬프트와 함께 LLM에 전달하여 응답을 생성하는 기능을 수행
        
        
        """
    def rag_prompt(context, query):
        """
        RAG 프롬프트 생성
        :param query: 사용자 질문
        :param context: 정책 데이터
        :return: LLM에 전달할 프롬프트 문자열
        """
        return f"""아래는 청년 정책 데이터입니다.

        {context}

        사용자 질문: {query}

        위 정책 정보를 참고하여 답변을 생성해 주세요.
        """

    def test_prompt(self):
        """
        테스트용 프롬프트
        """
        prompt = f"""
        <|start_header_id|>system<|end_header_id|>
        당신은 다음과 같은 전문성을 가진 AI 어시스턴트입니다:
        청년 정책 전문가
        
        작업 요구사항:
        1. 서울시 청년 정책에 대한 전문 지식을 갖추고 있습니다.
        2. 서울시 청년 정책에 대한 정보를 제공하고, 관련 질문에 답변합니다.
                

        <|eot_id|><|start_header_id|>user<|end_header_id|>
        입력 데이터:
        {}
        <|start_header_id|>assistant<|end_header_id|>
        # 출력 형식
        1. 서술형 텍스트로 작성
        2. 별도의 섹션 구분 없이 자연스러운 흐름
        """
        return prompt
    