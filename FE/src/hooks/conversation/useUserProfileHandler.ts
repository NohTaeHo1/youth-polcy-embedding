
import { generatePolicyResponse } from '@/services/gptService';
import { ConversationHandlerProps } from './types';

export const useUserProfileHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  conversationContext,
  userProfile,
  setOptions,
  setInputDisabled,
  setIsLoading
}: ConversationHandlerProps) => {
  
  const handleUserProfile = async (message: string) => {
    addUserMessage(message);
    
    // Process user profile information
    if (message.includes("나이") || message.includes("세")) {
      addBotMessage("나이 정보가 저장되었습니다. 지역(시/도)을 알려주세요.");
    } else if (message.includes("시") || message.includes("도") || message.includes("군") || message.includes("구")) {
      addBotMessage("지역 정보가 저장되었습니다. 현재 상황(취업준비/창업준비/재직중 등)을 알려주세요.");
    } else {
      addBotMessage(`프로필 정보가 모두 저장되었습니다.\n
나이: ${userProfile.age || "미입력"}\n
지역: ${userProfile.location || "미입력"}\n
상황: ${message}\n\n
이 정보를 바탕으로 맞춤형 정책을 찾아드리겠습니다.`);
      
      // 사용자 프로필 기반 맞춤형 정책 정보 요청
      setTimeout(async () => {
        try {
          setIsLoading(true);
          const profilePrompt = `제 나이는 ${userProfile.age || "미입력"}, 지역은 ${userProfile.location || "미입력"}, 현재 상황은 ${message}입니다. 이런 상황에 맞는 청년 정책을 추천해주세요.`;
          
          addBotMessage("맞춤형 정책 정보를 분석하고 있습니다...");
          
          const response = await generatePolicyResponse(
            [...conversationContext, { role: 'user', content: profilePrompt }]
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
          console.error("맞춤형 정책 정보 오류:", error);
          addBotMessage("죄송합니다. 맞춤형 정책 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
          setCurrentStep('ACTION_OPTIONS');
          setOptions(["처음으로 돌아가기"]);
          setInputDisabled(true);
        } finally {
          setIsLoading(false);
        }
      }, 1500);
    }
  };

  return { handleUserProfile };
};
