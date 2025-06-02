
import { ConversationHandlerProps } from './types';

export const useFeedbackHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  setInputDisabled,
  setOptions
}: ConversationHandlerProps) => {
  
  const handleFeedback = (message: string) => {
    addUserMessage(message);
    addBotMessage("소중한 피드백 감사합니다. 더 나은 서비스를 제공하기 위해 노력하겠습니다.");
    setCurrentStep('END');
    setTimeout(() => {
      addBotMessage("대화가 종료되었습니다. 더 필요한 사항이 있으시면 언제든지 다시 문의해 주세요.");
      setInputDisabled(true);
      setOptions(["처음으로"]);
    }, 1000);
  };

  return { handleFeedback };
};
