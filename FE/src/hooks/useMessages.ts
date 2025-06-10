
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, GPTMessage } from '@/types/conversation';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationContext, setConversationContext] = useState<GPTMessage[]>([]);

  // Function to add a bot message
  const addBotMessage = (content: string | React.ReactNode) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      type: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Add to conversation context if content is string
    if (typeof content === 'string') {
      setConversationContext(prev => [...prev, { role: 'assistant', content }]);
    }
  };

  // Function to add a user message
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Add to conversation context
    setConversationContext(prev => [...prev, { role: 'user', content }]);
  };

  return {
    messages,
    setMessages,
    conversationContext,
    setConversationContext,
    addBotMessage,
    addUserMessage
  };
};
