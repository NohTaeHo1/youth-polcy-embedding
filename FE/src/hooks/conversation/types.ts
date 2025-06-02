
import { UserProfile, GPTMessage, ConversationStep } from '@/types/conversation';

export interface ConversationHandlerProps {
  addUserMessage: (content: string) => void;
  addBotMessage: (content: string | React.ReactNode) => void;
  currentStep: ConversationStep;
  setCurrentStep: (step: ConversationStep) => void;
  conversationContext: GPTMessage[];
  userProfile: UserProfile;
  setOptions: (options: string[]) => void;
  setInputDisabled: (disabled: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  firstInteractionComplete?: boolean;
  setFirstInteractionComplete?: (complete: boolean) => void;
}
