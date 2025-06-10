
// import { useEffect } from 'react';
// import { ConversationFlowResult } from '@/types/conversation';
// import { useUserProfile } from './useUserProfile';
// import { useMessages } from './useMessages';
// import { useConversationState } from './useConversationState';
// import { useConversationHandlers } from './useConversationHandlers';

// export const useConversationFlow = (): ConversationFlowResult => {
//   // Combine all the hooks
//   const { userProfile } = useUserProfile();
  
//   const {
//     messages,
//     conversationContext,
//     setConversationContext,
//     addBotMessage,
//     addUserMessage
//   } = useMessages();
  
//   const {
//     currentStep,
//     setCurrentStep,
//     options,
//     setOptions,
//     inputDisabled,
//     setInputDisabled,
//     isLoading,
//     setIsLoading,
//     isInitialized,
//     setIsInitialized,
//     firstInteractionComplete,
//     setFirstInteractionComplete
//   } = useConversationState();
  
//   const {
//     handleSendMessage,
//     handleOptionSelect
//   } = useConversationHandlers({
//     addUserMessage,
//     addBotMessage,
//     currentStep,
//     setCurrentStep,
//     conversationContext,
//     userProfile,
//     setOptions,
//     setInputDisabled,
//     isLoading,
//     setIsLoading,
//     firstInteractionComplete,
//     setFirstInteractionComplete
//   });

//   // 대화 초기화 함수
//   const initializeConversation = () => {
//     if (isInitialized) return; // Prevent duplicate initialization
    
//     // Add user profile information to first message if available
//     let welcomeMessage = "안녕하세요! 청년정책 안내 서비스입니다. GPT를 활용한 지능형 정책 정보를 제공합니다.";
    
//     if (userProfile && userProfile.interests) {
//       welcomeMessage += `\n\n${userProfile.interests}에 관심이 있으신 것으로 확인되었습니다. 맞춤 정보를 제공해드리겠습니다.`;
      
//       // Add initial context based on user profile
//       setConversationContext([
//         { 
//           role: 'system', 
//           content: `이 사용자는 다음과 같은 프로필을 가지고 있습니다:
//           - 생년월일: ${userProfile.birthdate ? new Date(userProfile.birthdate).toLocaleDateString('ko-KR') : '정보 없음'}
//           - 성별: ${userProfile.gender === 'male' ? '남성' : userProfile.gender === 'female' ? '여성' : '정보 없음'}
//           - 거주지: ${userProfile.location || '정보 없음'}
//           - 관심분야: ${userProfile.interests || '정보 없음'}`
//         }
//       ]);
//     }
    
//     addBotMessage(welcomeMessage);
//     setTimeout(() => {
//       addBotMessage("시작하시려면 '추천 받기' 버튼을 눌러주세요.");
//       setOptions(["추천 받기"]);
//       setIsInitialized(true); // Mark as initialized
//     }, 500);
//   };

//   // 첫 로드 시 대화 초기화, 초기화 플래그를 사용하여 중복 방지
//   useEffect(() => {
//     initializeConversation();
//   }, []);  // Remove userProfile dependency to prevent re-initialization when profile changes

//   return {
//     messages,
//     options: firstInteractionComplete ? [] : options, // Only show options if first interaction is not complete
//     inputDisabled: firstInteractionComplete ? false : inputDisabled, // Enable input after first interaction
//     handleSendMessage,
//     handleOptionSelect,
//     currentStep,
//     isLoading
//   };
// };
import { useEffect } from 'react';
import { ConversationFlowResult } from '@/types/conversation';
import { useUserProfile } from './useUserProfile';
import { useMessages } from './useMessages';
import { useConversationState } from './useConversationState';
import { useConversationHandlers } from './useConversationHandlers';

export const useConversationFlow = (): ConversationFlowResult => {
  const { userProfile } = useUserProfile();

  const {
    messages,
    conversationContext,
    setConversationContext,
    addBotMessage,
    addUserMessage
  } = useMessages();

  const {
    options,
    setOptions,
    inputDisabled,
    setInputDisabled,
    isLoading,
    setIsLoading,
    isInitialized,
    setIsInitialized,
  } = useConversationState();

  const {
    handleSendMessage,
    handleOptionSelect
  } = useConversationHandlers({
    addUserMessage,
    addBotMessage,
    conversationContext,
    setOptions,
    setInputDisabled,
    isLoading,
    setIsLoading,
  });

  // 대화 초기화 함수
  const initializeConversation = () => {
  if (isInitialized) return;
  let welcomeMessage = "안녕하세요! 청년정책 안내 서비스입니다. GPT를 활용한 지능형 정책 정보를 제공합니다.";
  if (userProfile && userProfile.interests) {
    welcomeMessage += `\n\n${userProfile.interests}에 관심이 있으신 것으로 확인되었습니다. 맞춤 정보를 제공해드리겠습니다.`;
    setConversationContext([
      {
        role: 'system',
        content: `이 사용자는 다음과 같은 프로필을 가지고 있습니다:
        - 생년월일: ${userProfile.birthdate ? new Date(userProfile.birthdate).toLocaleDateString('ko-KR') : '정보 없음'}
        - 성별: ${userProfile.gender === 'male' ? '남성' : userProfile.gender === 'female' ? '여성' : '정보 없음'}
        - 거주지: ${userProfile.location || '정보 없음'}
        - 관심분야: ${userProfile.interests || '정보 없음'}`
      }
    ]);
  }
  addBotMessage(welcomeMessage);
  setTimeout(() => {
    addBotMessage("궁금한 정책을 아래 입력란에 자유롭게 입력해 주세요. (나이, 지역, 분야는 선택사항입니다)");
    setIsInitialized(true);
    setInputDisabled(false);
    
  }, 500);
};

  useEffect(() => {
    initializeConversation();
  }, []);

  return {
    messages,
    options,
    inputDisabled,
    handleSendMessage,
    handleOptionSelect,
    isLoading
  };
};