
// import { generatePolicyResponse } from '@/services/gptService';
// import { UserProfile, GPTMessage, ConversationStep } from '@/types/conversation';

// interface ConversationHandlersProps {
//   addUserMessage: (content: string) => void;
//   addBotMessage: (content: string | React.ReactNode) => void;
//   currentStep: ConversationStep;
//   setCurrentStep: (step: ConversationStep) => void;
//   conversationContext: GPTMessage[];
//   userProfile: UserProfile;
//   setOptions: (options: string[]) => void;
//   setInputDisabled: (disabled: boolean) => void;
//   isLoading: boolean;
//   setIsLoading: (loading: boolean) => void;
//   firstInteractionComplete: boolean;
//   setFirstInteractionComplete: (complete: boolean) => void;
// }

// export const useConversationHandlers = ({
//   addUserMessage,
//   addBotMessage,
//   currentStep,
//   setCurrentStep,
//   conversationContext,
//   userProfile,
//   setOptions,
//   setInputDisabled,
//   isLoading,
//   setIsLoading,
//   firstInteractionComplete,
//   setFirstInteractionComplete
// }: ConversationHandlersProps) => {
  
//   const handleSendMessage = async (
//   message: string,
//   profile?: { age?: number; region?: string; category?: string }
//   ) => {
//     addUserMessage(message);
//     setIsLoading(true);
//     try {
//       const response = await generatePolicyResponse([
//         ...conversationContext,
//         { role: 'user', content: message },
//         // 필요하다면 profile 정보를 system 메시지로 추가
//       ], profile);
//       addBotMessage(response);
//       setCurrentStep('ACTION_OPTIONS');
//       setOptions([
//         "다른 질문하기", "정보 저장하기", "공유하기", "신청방법 자세히 알아보기"
//       ]);
//       setInputDisabled(true);
//     } catch (error) {
//       addBotMessage("죄송합니다. 정보를 가져오는 중 오류가 발생했습니다.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // Function to handle sending messages
//   // const handleSendMessage = async (message: string) => {
//   //   addUserMessage(message);
//   //   setIsLoading(true);
    
//   //   // Handle different steps in the conversation flow
//   //   switch (currentStep) {
//   //     case 'FREE_CONVERSATION':
//   //     case 'ASK_ADDITIONAL_QUESTIONS':
//   //       try {
//   //         // 사용자 질문으로부터 정보를 추출하고 관련 정책 정보 생성
//   //         const response = await generatePolicyResponse(
//   //           [...conversationContext, { role: 'user', content: message }]
//   //         );
//   //         addBotMessage(response);
          
//   //         // 답변 후 사용자에게 추가 액션 제공 (사용자 경험 향상)
//   //         setTimeout(() => {
//   //           setCurrentStep('ACTION_OPTIONS');
//   //           setOptions([
//   //             "다른 질문하기", 
//   //             "정보 저장하기", 
//   //             "공유하기", 
//   //             "신청방법 자세히 알아보기"
//   //           ]);
//   //           setInputDisabled(true);
//   //         }, 1000);
//   //       } catch (error) {
//   //         console.error("LLM 응답 생성 오류:", error);
//   //         addBotMessage("죄송합니다. 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
//   //       } finally {
//   //         setIsLoading(false);
//   //       }
//   //       break;
        
//   //     case 'COLLECT_USER_PROFILE':
//   //       // 사용자 프로필 정보를 저장하고 맞춤형 정책 추천 제공
//   //       addBotMessage(`프로필 정보가 저장되었습니다!\n${message}\n\n이 정보를 바탕으로 맞춤형 정책을 찾아드리겠습니다.`);
        
//   //       setTimeout(async () => {
//   //         try {
//   //           const profilePrompt = `사용자 정보: ${message}. 이런 상황에 맞는 청년 정책을 추천해주세요.`;
            
//   //           addBotMessage("맞춤형 정책 정보를 분석하고 있습니다...");
            
//   //           const response = await generatePolicyResponse(
//   //             [...conversationContext, { role: 'user', content: profilePrompt }]
//   //           );
            
//   //           addBotMessage(response);
//   //           setCurrentStep('ACTION_OPTIONS');
//   //           setOptions([
//   //             "다른 질문하기", 
//   //             "정보 저장하기", 
//   //             "공유하기", 
//   //             "신청방법 자세히 알아보기"
//   //           ]);
//   //           setInputDisabled(true);
//   //         } catch (error) {
//   //           console.error("맞춤형 정책 정보 오류:", error);
//   //           addBotMessage("죄송합니다. 맞춤형 정책 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
//   //           setCurrentStep('ACTION_OPTIONS');
//   //           setOptions(["처음으로 돌아가기"]);
//   //           setInputDisabled(true);
//   //         } finally {
//   //           setIsLoading(false);
//   //         }
//   //       }, 1500);
//   //       break;
        
//   //     case 'COLLECT_USER_FEEDBACK':
//   //       addBotMessage("소중한 피드백 감사합니다. 더 나은 서비스를 제공하기 위해 노력하겠습니다.");
//   //       setCurrentStep('END');
//   //       setTimeout(() => {
//   //         addBotMessage("대화가 종료되었습니다. 더 필요한 사항이 있으시면 언제든지 다시 문의해 주세요.");
//   //         setInputDisabled(true);
//   //         setOptions(["처음으로"]);
//   //       }, 1000);
//   //       break;
        
//   //     default:
//   //       // 정보 추출을 위한 기본 처리 로직
//   //       try {
//   //         // 사용자 메시지를 분석하여 관련 정책 정보 응답
//   //         const response = await generatePolicyResponse(
//   //           [...conversationContext, { role: 'user', content: message }]
//   //         );
//   //         addBotMessage(response);
//   //         setCurrentStep('ACTION_OPTIONS');
//   //         setOptions([
//   //           "다른 질문하기", 
//   //           "정보 저장하기", 
//   //           "공유하기", 
//   //           "신청방법 자세히 알아보기"
//   //         ]);
//   //         setInputDisabled(true);
//   //       } catch (error) {
//   //         console.error("응답 생성 오류:", error);
//   //         addBotMessage("죄송합니다. 정보를 분석하는 중에 오류가 발생했습니다. 다른 질문을 해주시겠어요?");
//   //         setInputDisabled(false);
//   //       } finally {
//   //         setIsLoading(false);
//   //       }
//   //   }
//   // };

//   // // Function to handle option selection
//   const handleOptionSelect = async (option: string) => {
//     addUserMessage(option);
    
//     switch (currentStep) {
//       case 'GREETING':
//         if (option === "추천 받기") {
//           // 사용자 프로필 수집 단계로 이동
//           setCurrentStep('COLLECT_USER_PROFILE');
//           setFirstInteractionComplete(true);
//           setOptions([]);
//           setInputDisabled(true);
//           setTimeout(() => {
//             addBotMessage("맞춤형 정책 추천을 위해 몇 가지 정보를 입력해주세요.");
//           }, 500);
//         }
//         break;
        
//       case 'ACTION_OPTIONS':
//         if (option === "다른 질문하기") {
//           setCurrentStep('ASK_ADDITIONAL_QUESTIONS');
//           setInputDisabled(false);
//           addBotMessage("추가 질문이 있으시면 자유롭게 물어보세요.");
//         } else if (option === "정보 저장하기") {
//           addBotMessage("이 정보는 저장되었습니다. 마이페이지에서 확인하실 수 있습니다.");
//           setCurrentStep('COLLECT_USER_FEEDBACK');
//           setInputDisabled(false);
//           addBotMessage("서비스 이용에 대한 피드백이 있으시면 자유롭게 남겨주세요.");
//         } else if (option === "공유하기") {
//           addBotMessage("이 정보를 공유할 수 있는 링크가 생성되었습니다: https://policy-chat.example.com/share/12345");
//           setCurrentStep('ASK_NEW_SEARCH');
//           setOptions(["새로운 정책 검색하기", "대화 종료하기"]);
//           setInputDisabled(true);
//         } else if (option === "신청방법 자세히 알아보기") {
//           addBotMessage("신청 방법에 대한 상세 정보를 안내해드리겠습니다. 잠시만 기다려주세요...");
//           setTimeout(() => {
//             addBotMessage("정책 신청 방법:\n1. 해당 정책 운영 기관 웹사이트 방문\n2. 회원가입 후 로그인\n3. 신청서 작성 및 제출\n4. 필요 서류 업로드\n5. 심사 결과 대기\n\n자세한 내용은 해당 기관의 고객센터로 문의하시기 바랍니다.");
//             setCurrentStep('ASK_NEW_SEARCH');
//             setOptions(["새로운 정책 검색하기", "대화 종료하기"]);
//             setInputDisabled(true);
//           }, 1500);
//         }
//         break;
        
//       case 'ASK_NEW_SEARCH':
//         if (option === "새로운 정책 검색하기") {
//           setCurrentStep('FREE_CONVERSATION');
//           setInputDisabled(false);
//           addBotMessage("어떤 정책에 관심이 있으신가요? 자유롭게 질문해 주세요.");
//         } else if (option === "대화 종료하기") {
//           setCurrentStep('END');
//           addBotMessage("대화가 종료되었습니다. 더 필요한 사항이 있으시면 언제든지 다시 문의해 주세요.");
//           setInputDisabled(true);
//           setOptions(["처음으로"]);
//         }
//         break;
        
//       case 'END':
//         if (option === "처음으로") {
//           setCurrentStep('GREETING');
//           setOptions(["추천 받기"]);
//           setFirstInteractionComplete(false);
//           addBotMessage("시작하시려면 '추천 받기' 버튼을 눌러주세요.");
//           setInputDisabled(true);
//         }
//         break;
//     }
//   };

//   return {
//     handleSendMessage,
//     handleOptionSelect
//   };
// };
import { generatePolicyResponse } from '@/services/gptService';
import { UserProfile, GPTMessage } from '@/types/conversation';

interface ConversationHandlersProps {
  addUserMessage: (content: string) => void;
  addBotMessage: (content: string | React.ReactNode) => void;
  conversationContext: GPTMessage[];
  setOptions: (options: string[]) => void;
  setInputDisabled: (disabled: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useConversationHandlers = ({
  addUserMessage,
  addBotMessage,
  conversationContext,
  setOptions,
  setInputDisabled,
  isLoading,
  setIsLoading,
}: ConversationHandlersProps) => {

  const handleSendMessage = async (
    message: string,
    profile?: { age?: number; region?: string; category?: string }
  ) => {
    addUserMessage(message);
    setIsLoading(true);
    try {
      const response = await generatePolicyResponse([
        ...conversationContext,
        { role: 'user', content: message }
      ], profile);
      addBotMessage(response);
      setOptions([
        "다른 질문하기", "정보 저장하기", "공유하기", "신청방법 자세히 알아보기"
      ]);
      setInputDisabled(true);
    } catch (error) {
      addBotMessage("죄송합니다. 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (option: string) => {
    addUserMessage(option);
    if (option === "다른 질문하기") {
      setInputDisabled(false);
      addBotMessage("추가 질문이 있으시면 자유롭게 물어보세요.");
    } else if (option === "정보 저장하기") {
      addBotMessage("이 정보는 저장되었습니다. 마이페이지에서 확인하실 수 있습니다.");
      setInputDisabled(false);
    } else if (option === "공유하기") {
      addBotMessage("이 정보를 공유할 수 있는 링크가 생성되었습니다: https://policy-chat.example.com/share/12345");
      setInputDisabled(false);
    } else if (option === "신청방법 자세히 알아보기") {
      addBotMessage("신청 방법에 대한 상세 정보를 안내해드리겠습니다. 잠시만 기다려주세요...");
      setTimeout(() => {
        addBotMessage("정책 신청 방법:\n1. 해당 정책 운영 기관 웹사이트 방문\n2. 회원가입 후 로그인\n3. 신청서 작성 및 제출\n4. 필요 서류 업로드\n5. 심사 결과 대기\n\n자세한 내용은 해당 기관의 고객센터로 문의하시기 바랍니다.");
        setInputDisabled(false);
      }, 1500);
    }
  };

  return {
    handleSendMessage,
    handleOptionSelect
  };
};
