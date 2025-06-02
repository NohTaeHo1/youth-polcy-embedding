
import { ConversationHandlerProps } from './types';

export const useGreetingHandler = ({
  addBotMessage,
  setCurrentStep,
  setFirstInteractionComplete,
  userProfile,
  setOptions,
  setInputDisabled
}: ConversationHandlerProps) => {
  
  const handleGreeting = (option: string) => {
    // 대화 시작
    setCurrentStep('FREE_CONVERSATION');
    setFirstInteractionComplete(true); // Mark first interaction as complete
    setTimeout(() => {
      // 개인화된 환영 메시지 및 정책 추천
      let welcomeMessage = "안녕하세요! 청년정책 AI 상담 서비스입니다. ";
      
      if (userProfile && userProfile.interests) {
        welcomeMessage += `${userProfile.interests}에 관심이 있으신 것으로 확인되었습니다.\n\n`;
        
        // 관심사에 따른 맞춤형 정책 추천
        switch(userProfile.interests) {
          case "취업지원":
            welcomeMessage += "취업지원 관련 추천 정책:\n1. 청년취업성공패키지: 만 18-34세 청년 대상 단계별 취업지원 서비스\n2. 청년내일채움공제: 중소기업 취업 청년 자산형성 지원\n3. 국민취업지원제도: 취업지원서비스와 소득지원 결합 서비스";
            break;
          case "주거지원":
            welcomeMessage += "주거지원 관련 추천 정책:\n1. 청년 전용 버팀목 전세 특별보증: 만 19-34세 청년층 전용 전세대출 지원\n2. 청년 매입임대주택: 시세 70% 이하 임대료로 최장 6년 거주 가능\n3. 행복주택: 대학생, 사회초년생, 신혼부부 등 청년층 특화 임대주택";
            break;
          case "금융지원":
            welcomeMessage += "금융지원 관련 추천 정책:\n1. 청년희망적금: 저소득 청년층 자산형성 지원\n2. 청년 임차보증금 융자: 청년 주거비 부담 완화 위한 임차보증금 대출\n3. 햇살론유스: 저신용 청년층 대상 서민금융진흥원 지원 대출";
            break;
          case "교육지원":
            welcomeMessage += "교육지원 관련 추천 정책:\n1. 국가장학금: 대학생 등록금 부담 경감 위한 장학금\n2. 학자금대출: 교육부와 한국장학재단을 통한 저리 대출\n3. K-MOOC: 대학 수준의 우수 강의를 무료로 제공하는 온라인 강좌";
            break;
          case "창업지원":
            welcomeMessage += "창업지원 관련 추천 정책:\n1. 청년창업사관학교: 유망 청년창업가 발굴 및 집중지원\n2. 창업성공패키지: 창업 교육, 멘토링, 사업화 자금까지 종합지원\n3. 1인 창조기업 지원센터: 사무공간 제공 및 경영·마케팅·세무 등 전문가 상담";
            break;
          case "문화지원":
            welcomeMessage += "문화지원 관련 추천 정책:\n1. 청년문화패스: 청년층 문화활동 지원 바우처\n2. 통합문화이용권(문화누리카드): 경제적 취약계층 대상 문화예술 지원금\n3. 지역 청년예술가 지원사업: 지역 기반 청년예술가 창작활동 지원";
            break;
          case "건강지원":
            welcomeMessage += "건강지원 관련 추천 정책:\n1. 청년 마음건강바우처: 청년층 심리상담 서비스 비용 지원\n2. 청년층 국가건강검진: 청년 특화 건강검진 지원\n3. 청년 구강건강 지원사업: 취약계층 청년 치과 진료비 지원";
            break;
          default:
            welcomeMessage += "어떤 정책에 관심이 있으신가요? 자유롭게 질문해 주세요.";
        }
      } else {
        welcomeMessage += "어떤 정책에 관심이 있으신가요? 자유롭게 질문해 주세요.";
      }
      
      addBotMessage(welcomeMessage);
      setInputDisabled(false);
    }, 500);
  };

  return { handleGreeting };
};
