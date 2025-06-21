
import { ReactNode } from 'react';

export type ConversationStep = 
  | 'GREETING'
  | 'POLICY_INFO_OPTIONS'
  | 'POLICY_RESPONSE'
  | 'ASK_ADDITIONAL_QUESTIONS'
  | 'ACTION_OPTIONS'
  | 'ASK_NEW_SEARCH'
  | 'COLLECT_USER_FEEDBACK'
  | 'COLLECT_USER_PROFILE'
  | 'FREE_CONVERSATION'
  | 'END';

export interface UserProfile {
  birthdate?: Date;
  gender?: 'male' | 'female' | 'other';
  location?: string;
  interests?: string;
  age?: string;
  situation?: string;
}

export interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message {
  id: string;
  content: string | ReactNode;
  type: 'bot' | 'user';
  timestamp: Date;
}

export interface ConversationFlowResult {
  messages: Message[];
  options: string[];
  inputDisabled: boolean;
  handleSendMessage: (message: string) => void;
  handleOptionSelect: (option: string) => void;
  currentStep: ConversationStep;
  isLoading: boolean;
}

export interface SimulatorFormData {
  monthlyRent: number;
  deposit: number;
  householdSize: number;
}

export interface PolicyResult {
  title: string;
  description: string;
  support: string;
}