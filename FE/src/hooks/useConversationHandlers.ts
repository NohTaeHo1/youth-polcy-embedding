// useConversationHandlers.ts 파일 전체를 아래 코드로 교체하세요.

import { generatePolicyResponse } from '@/services/gptService';
import { GPTMessage } from '@/types/conversation';

interface ConversationHandlersProps {
  addUserMessage: (content: string) => void;
  // addBotMessage가 객체를 받을 수 있도록 타입을 수정하거나,
  // useMessages 훅에서 처리 로직을 수정해야 합니다.
  addBotMessage: (message: any) => void;
  conversationContext: GPTMessage[];
  setOptions: (options: string[]) => void;
  setInputDisabled: (disabled: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useConversationHandlers = ({
  addUserMessage,
  addBotMessage,
  conversationContext,
  setOptions,
  setInputDisabled,
  setIsLoading,
}: ConversationHandlersProps) => {

  const handleSendMessage = async (
    message: string,
    profile?: { age?: number; region?: string; category?: string }
  ) => {
    addUserMessage(message);
    setIsLoading(true);
    setOptions([]); // 이전 옵션 버튼들을 제거합니다.

    try {
      const response = await generatePolicyResponse(
        [...conversationContext, { role: 'user', content: message }],
        profile
      );

      if (Array.isArray(response) && response.length > 0 && response[0].plcyNm) {
        addBotMessage({
          id: Date.now().toString(),
          mode: 'rag',
          policy_detail: response[0],
          type: 'bot',
        });
      } else {
        addBotMessage({
          id: Date.now().toString(),
          mode: 'llm',
          type: 'bot',
          content: response,
        });
      }

      // ★★★ 1. 응답 후 항상 옵션 버튼을 설정합니다. ★★★
      setOptions(["시뮬레이션", "다른 질문 하기"]);
      // setInputDisabled(true); // 옵션을 선택해야 하므로 입력창 비활성화

    } catch (error) {
      addBotMessage({
        id: Date.now().toString(),
        type: 'bot',
        content: "죄송합니다. 정보를 가져오는 중 오류가 발생했습니다."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (option: string) => {
    addUserMessage(option);
    setOptions([]); // 옵션을 선택했으므로 버튼을 제거합니다.

    // ★★★ 2. '시뮬레이션' 옵션을 처리합니다. ★★★
    if (option === "시뮬레이션") {
      // 페이지를 /simulator로 이동시킵니다.
      window.location.href = '/simulator';
      return; // 이동 후 함수 종료
    }
    
    if (option === "다른 질문 하기") {
      addBotMessage("궁금한 점을 다시 입력해주세요.");
      setInputDisabled(false); // 다시 질문할 수 있도록 입력창 활성화
    }
    // 다른 옵션들에 대한 처리를 여기에 추가할 수 있습니다.
  };

  return {
    handleSendMessage,
    handleOptionSelect,
  };
};
