
import { ConversationHandlerProps } from './types';

export const useEndHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  setOptions,
  setFirstInteractionComplete
}: ConversationHandlerProps) => {
  
  const handleEnd = (option: string) => {
    addUserMessage(option);
    
    if (option === "처음으로") {
      setCurrentStep('GREETING');
      setOptions(["추천 받기"]);
      setFirstInteractionComplete(false); // Reset first interaction state
      addBotMessage("시작하시려면 '추천 받기' 버튼을 눌러주세요.");
    }
  };

  return { handleEnd };
};
