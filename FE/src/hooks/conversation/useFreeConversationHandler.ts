
import { generatePolicyResponse } from '@/services/gptService';
import { ConversationHandlerProps } from './types';

export const useFreeConversationHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  conversationContext,
  setOptions,
  setInputDisabled,
  setIsLoading
}: ConversationHandlerProps) => {
  
  const handleFreeConversation = async (message: string) => {
    addUserMessage(message);
    setIsLoading(true);
    
    try {
      // 사용자 질문으로부터 정보를 추출하고 관련 정책 정보 생성
      const response = await generatePolicyResponse(
        [...conversationContext, { role: 'user', content: message }]
      );
      addBotMessage(response);
      
      // 답변 후 사용자에게 추가 액션 제공 (사용자 경험 향상)
      setTimeout(() => {
        setCurrentStep('ACTION_OPTIONS');
        setOptions([
          "다른 질문하기", 
          "정보 저장하기", 
          "공유하기", 
          "신청방법 자세히 알아보기"
        ]);
        setInputDisabled(true);
      }, 1000);
    } catch (error) {
      console.error("LLM 응답 생성 오류:", error);
      addBotMessage("죄송합니다. 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleFreeConversation };
};
