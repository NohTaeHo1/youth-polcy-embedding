
import { ConversationHandlerProps } from './types';

export const useNewSearchHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  setInputDisabled,
  setOptions
}: ConversationHandlerProps) => {
  
  const handleNewSearch = (option: string) => {
    addUserMessage(option);
    
    if (option === "새로운 정책 검색하기") {
      setCurrentStep('FREE_CONVERSATION');
      setInputDisabled(false);
      addBotMessage("어떤 정책에 관심이 있으신가요? 자유롭게 질문해 주세요.");
    } else if (option === "대화 종료하기") {
      setCurrentStep('END');
      addBotMessage("대화가 종료되었습니다. 더 필요한 사항이 있으시면 언제든지 다시 문의해 주세요.");
      setInputDisabled(true);
      setOptions(["처음으로"]);
    }
  };

  return { handleNewSearch };
};
