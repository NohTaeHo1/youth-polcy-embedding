
import { useState } from 'react';
import { ConversationStep } from '@/types/conversation';

export const useConversationState = () => {
  const [currentStep, setCurrentStep] = useState<ConversationStep>('GREETING');
  const [options, setOptions] = useState<string[]>([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [firstInteractionComplete, setFirstInteractionComplete] = useState(false);

  return {
    currentStep,
    setCurrentStep,
    options,
    setOptions,
    inputDisabled,
    setInputDisabled,
    isLoading,
    setIsLoading,
    isInitialized,
    setIsInitialized,
    firstInteractionComplete,
    setFirstInteractionComplete
  };
};
