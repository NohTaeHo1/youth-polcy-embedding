
import { ConversationHandlerProps } from './types';

export const useActionOptionsHandler = ({
  addUserMessage,
  addBotMessage,
  setCurrentStep,
  setInputDisabled,
  setOptions
}: ConversationHandlerProps) => {
  
  const handleActionOptions = (option: string) => {
    addUserMessage(option);
    
    if (option === "다른 질문하기") {
      setCurrentStep('ASK_ADDITIONAL_QUESTIONS');
      setInputDisabled(false);
      addBotMessage("추가 질문이 있으시면 자유롭게 물어보세요.");
    } else if (option === "정보 저장하기") {
      addBotMessage("이 정보는 저장되었습니다. 마이페이지에서 확인하실 수 있습니다.");
      setCurrentStep('COLLECT_USER_FEEDBACK');
      setInputDisabled(false);
      addBotMessage("서비스 이용에 대한 피드백이 있으시면 자유롭게 남겨주세요.");
    } else if (option === "공유하기") {
      addBotMessage("이 정보를 공유할 수 있는 링크가 생성되었습니다: https://policy-chat.example.com/share/12345");
      setCurrentStep('ASK_NEW_SEARCH');
      setOptions(["새로운 정책 검색하기", "대화 종료하기"]);
    } else if (option === "신청방법 자세히 알아보기") {
      addBotMessage("신청 방법에 대한 상세 정보를 안내해드리겠습니다. 잠시만 기다려주세요...");
      setTimeout(() => {
        addBotMessage("정책 신청 방법:\n1. 해당 정책 운영 기관 웹사이트 방문\n2. 회원가입 후 로그인\n3. 신청서 작성 및 제출\n4. 필요 서류 업로드\n5. 심사 결과 대기\n\n자세한 내용은 해당 기관의 고객센터로 문의하시기 바랍니다.");
        setCurrentStep('ASK_NEW_SEARCH');
        setOptions(["새로운 정책 검색하기", "대화 종료하기"]);
      }, 1500);
    }
  };

  return { handleActionOptions };
};
