
import { generatePolicyResponse } from '@/services/gptService';
import { ConversationHandlerProps } from './types';

export const useDefaultHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  conversationContext,
  setOptions,
  setInputDisabled,
  setIsLoading
}: ConversationHandlerProps) => {
  
  const handleDefault = async (message: string) => {
    addUserMessage(message);
    setIsLoading(true);
    
    try {
      // 사용자 메시지를 분석하여 관련 정책 정보 응답
      const response = await generatePolicyResponse(
        [...conversationContext, { role: 'user', content: message }]
      );
      addBotMessage(response);
      setCurrentStep('ACTION_OPTIONS');
      setOptions([
        "다른 질문하기", 
        "정보 저장하기", 
        "공유하기", 
        "신청방법 자세히 알아보기"
      ]);
      setInputDisabled(true);
    } catch (error) {
      console.error("응답 생성 오류:", error);
      addBotMessage("죄송합니다. 정보를 분석하는 중에 오류가 발생했습니다. 다른 질문을 해주시겠어요?");
      setInputDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleDefault };
};
