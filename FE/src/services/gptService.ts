
import { toast } from "sonner";

interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
export const generatePolicyResponse = async (
  messages: LLMMessage[],
  profile?: { age?: number; region?: string; category?: string }
): Promise<string> => {
  try {
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    if (!lastUserMessage) return "질문을 입력해주세요.";

    const body: any = { query: lastUserMessage.content };
    if (profile?.age) {
      body.min_age = profile.age;
      body.max_age = profile.age;
    }
    if (profile?.region) body.region = profile.region;
    if (profile?.category) body.category = profile.category;
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const response = await fetch(`${API_URL}/llm/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("정책 정보를 가져오는데 실패했습니다.");
    const data = await response.json();
    
    if (data.mode === "llm" && data.llm_response) {
      return data.llm_response;
    } else if (data.results) {
      return formatPolicyResults(data.results);
    } else if (data.llm_response) {
      return data.llm_response;
    } else {
      return "죄송합니다. 정책 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  } catch (error) {
    console.error("정책 정보 생성 오류:", error);
    toast.error("정책 정보를 가져오는데 문제가 발생했습니다.");
    return "죄송합니다. 정책 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

// export const generatePolicyResponse = async (messages: GPTMessage[]): Promise<string> => {
//   try {
//     // 마지막 사용자 메시지 가져오기
//     const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
//     if (!lastUserMessage) return "질문을 입력해주세요.";

//     // 백엔드 API 호출
//     const response = await fetch("http://localhost:8000/search/hybrid", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: lastUserMessage.content,
//         min_age: 25,  // 사용자 프로필에서 가져오기
//         max_age: 25,  // 사용자 프로필에서 가져오기
//         region: "서울특별시",  // 사용자 프로필에서 가져오기
//         category: "일자리" // 질문 컨텍스트에서 추출
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("정책 정보를 가져오는데 실패했습니다.");
//     }

//     const data = await response.json();
    
//     // 결과 포맷팅
//     const formattedResponse = formatPolicyResults(data.results);
//     return formattedResponse;

//   } catch (error) {
//     console.error("정책 정보 생성 오류:", error);
//     toast.error("정책 정보를 가져오는데 문제가 발생했습니다.");
//     return "죄송합니다. 정책 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
//   }
// };

// 결과 포맷팅 함수
const formatPolicyResults = (results: any[]): string => {
  if (!results || results.length === 0) {
    return "죄송합니다. 조건에 맞는 정책을 찾지 못했습니다.";
  }

  let response = "찾은 정책 정보를 알려드리겠습니다:\n\n";
  
  results.forEach((policy, index) => {
    response += `${index + 1}. ${policy.title}\n`;
    response += `• 지원대상: ${policy.target_age}세\n`;
    response += `• 카테고리: ${policy.category}\n`;
    response += `• 지원내용: ${policy.support_content?.substring(0, 200)}...\n`;
    response += `• 담당기관: ${policy.organization}\n\n`;
  });

  response += "\n더 자세한 정보가 필요하시거나 다른 질문이 있으신가요?";
  
  return response;
};

// export const generatePolicyResponse = async (messages: GPTMessage[]): Promise<string> => {
//   try {
//     // 여기에 실제 LLM 데이터랑 반환 해야할 데이터를 화면에 보여줌.
//     const apiKey = process.env.REACT_APP_OPENAI_API_KEY || ""; // 실제 배포 시에는 환경 변수나 안전한 방법으로 API 키 관리 필요
    
//     if (!apiKey) {
//       console.warn("API 키가 설정되지 않았습니다. 예시 응답을 반환합니다.");
//       return generateMockResponse(messages);
//     }

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o", // gpt-3.5-turbo나 다른 모델을 사용할 수도 있습니다
//         messages: [
//           {
//             role: "system",
//             content: `당신은 청년들에게 정책 정보를 제공하는 정책 상담사입니다. 
//             청년들이 이용할 수 있는 다양한 정책(취업, 주거, 교육, 창업 등)에 대한 정보를 친절하게 안내해주세요.
            
//             사용자의 질문에서 핵심 키워드와 의도를 정확히 파악하고, 그에 맞는 정책 정보를 제공해야 합니다.
//             질문 내용에 따라 관련 있는 정책만 선별적으로 안내하세요.
            
//             정책의 지원 대상, 지원 내용, 신청 방법, 신청 기간, 문의처 등에 대해 구체적으로 안내해주세요.
//             대한민국 정부와 각 지방자치단체에서 제공하는 청년 정책에 대해 알려주세요.
//             정확한 정보를 제공하고, 만약 특정 정보를 모른다면 솔직하게 모른다고 말해주세요.
            
//             정보 제공 후에는 "더 궁금한 점이 있으신가요?"와 같이 추가 질문을 유도해주세요.`
//           },
//           ...messages
//         ],
//         temperature: 0.7,
//         max_tokens: 800,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("GPT API 오류:", errorData);
//       throw new Error("정책 정보를 가져오는데 실패했습니다.");
//     }

//     const data: GPTResponse = await response.json();
//     return data.choices[0].message.content;
//   } catch (error) {
//     console.error("정책 정보 생성 오류:", error);
//     toast.error("정책 정보를 가져오는데 문제가 발생했습니다.");
//     return "죄송합니다. 정책 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
//   }
// };

// API 키가 없을 때 사용할 예시 응답 생성기
// const generateMockResponse = (messages: GPTMessage[]): string => {
//   // 마지막 사용자 메시지 가져오기
//   const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
//   if (!lastUserMessage) return "질문을 입력해주세요.";
  
//   const query = lastUserMessage.content.toLowerCase();
  
//   if (query.includes("취업") || query.includes("일자리") || query.includes("직장")) {
//     return `청년 취업 지원 정책에 대한 정보입니다:

// 1. 청년취업성공패키지: 만 34세 이하 청년 대상, 취업 상담부터 교육, 취업 알선까지 종합 지원
//    - 지원내용: 1단계(상담) → 2단계(직업훈련) → 3단계(취업알선)
//    - 훈련비 최대 500만원 지원 및 참여수당 월 50만원
//    - 신청방법: 가까운 고용센터 방문 또는 워크넷 온라인 신청

// 2. 청년내일채움공제: 중소기업 취업 청년의 자산형성 지원
//    - 2년형: 본인 300만원 + 정부 900만원 + 기업 400만원 = 총 1,600만원
//    - 3년형: 본인 600만원 + 정부 1,800만원 + 기업 600만원 = 총 3,000만원
//    - 신청방법: 워크넷 청년내일채움공제 홈페이지에서 신청
   
// 더 자세한 취업 지원 정책에 대해 알고 싶으신가요?`;
//   } else if (query.includes("주거") || query.includes("집") || query.includes("전세") || query.includes("월세") || query.includes("임대")) {
//     return `청년 주거 지원 정책 정보입니다:

// 1. 청년 전용 버팀목 전세자금 대출
//    - 대상: 만 19세~34세 이하 청년
//    - 내용: 최대 7천만원까지 전세자금 대출, 금리 1.8~2.7%
//    - 신청방법: 주택도시기금 수탁은행 방문 신청

// 2. 청년 매입임대주택
//    - 대상: 만 19세~39세 이하 무주택 청년
//    - 내용: 시중 임대료의 30~50% 수준으로 최대 6년간 거주 가능
//    - 신청방법: LH 청약센터 홈페이지 신청

// 3. 청년 주거급여 분리지급
//    - 대상: 기준 중위소득 46% 이하 가구의 청년
//    - 내용: 본인 명의 주거지가 있는 경우 별도 주거급여 지급
//    - 신청방법: 주민센터 방문 신청
   
// 주거 지원에 관해 더 구체적인 질문이 있으신가요?`;
//   } else if (query.includes("교육") || query.includes("학비") || query.includes("장학금") || query.includes("대학")) {
//     return `청년 교육 지원 정책 정보입니다:

// 1. 국가장학금
//    - 대상: 대학생 중 소득 8구간(분위) 이하
//    - 내용: 소득 수준에 따라 학기당 최대 350만원 지원
//    - 신청방법: 한국장학재단 홈페이지에서 신청

// 2. 청년 희망사다리 장학금
//    - 대상: 중소기업 취업 또는 창업 예정인 대학생
//    - 내용: 등록금 전액 및 학업지원비 200만원 지원
//    - 의무사항: 졸업 후 중소기업 취업 또는 창업
//    - 신청방법: 한국장학재단 홈페이지에서 신청
   
// 교육비 지원이나 다른 장학 제도에 대해 더 알고 싶으신가요?`;
//   } else if (query.includes("창업") || query.includes("사업")) {
//     return `청년 창업 지원 정책 정보입니다:

// 1. 청년창업사관학교
//    - 대상: 만 39세 이하 예비창업자 또는 3년 미만 기업의 대표자
//    - 내용: 창업 공간, 시제품 제작, 마케팅 등에 최대 1억원 지원
//    - 신청방법: 중소벤처기업부 K-스타트업 홈페이지에서 신청

// 2. 청년 스타트업 창업패키지
//    - 대상: 만 39세 이하 예비창업자
//    - 내용: 창업교육, 멘토링, 사업화자금 최대 1억원 지원
//    - 신청방법: 창업진흥원 홈페이지에서 신청
   
// 창업 준비 단계나 특정 분야에 대한 지원이 더 필요하신가요?`;
//   } else if (query.includes("금융") || query.includes("대출") || query.includes("적금")) {
//     return `청년 금융 지원 정책 정보입니다:

// 1. 청년희망적금
//    - 대상: 만 19~34세 소득 기준 중위소득 100% 이하 청년
//    - 내용: 2년간 매월 최대 50만원 적립 시 정부지원금 추가 지급
//    - 신청방법: 지정 금융기관 방문 신청

// 2. 청년 대출 이자 지원
//    - 대상: 만 39세 이하 청년 중 학자금, 전월세자금 대출 이용자
//    - 내용: 연 최대 3% 이자 지원, 최대 1백만원까지
//    - 신청방법: 주민센터 또는 관할 지자체 홈페이지 신청
   
// 금융 지원에 관해 더 구체적인 내용이 필요하신가요?`;
//   } else if (query.includes("병역") || query.includes("군대") || query.includes("군복무")) {
//     return `청년 병역 지원 정책 정보입니다:

// 1. 청년 장병 주택지원
//    - 대상: 현역 복무 중인 병사 중 거주지 문제가 있는 경우
//    - 내용: 전역 후 LH 임대주택 우선 배정 혜택
//    - 신청방법: 복무 중 부대 인사과를 통해 신청

// 2. 전역 장병 취업 지원
//    - 대상: 전역 예정 및 전역 후 1년 이내 장병
//    - 내용: 취업 교육, 자격증 취득 지원, 채용 박람회 참여 기회 제공
//    - 신청방법: 제대군인지원센터 방문 또는 온라인 신청
   
// 병역 관련 지원에 대해 더 알고 싶으신 내용이 있으신가요?`;
//   } else if (query.includes("복지") || query.includes("건강") || query.includes("의료")) {
//     return `청년 복지 및 건강 지원 정책 정보입니다:

// 1. 청년 마음건강 바우처
//    - 대상: 만 19~34세 청년
//    - 내용: 심리상담 서비스 이용 시 회당 최대 3만원 지원, 연간 10회까지
//    - 신청방법: 주민센터 또는 복지로 홈페이지 신청

// 2. 청년 건강검진 지원
//    - 대상: 만 19~39세 건강보험 가입 청년
//    - 내용: 2년마다 무료 건강검진, 정신건강 스크리닝 포함
//    - 신청방법: 국민건강보험공단 홈페이지에서 신청
   
// 건강 관련 다른 지원 제도에 대해서도 알려드릴까요?`;
//   } else {
//     return `말씀하신 "${query}" 관련 청년정책에 대한 정보입니다.

// 현재 다음과 같은 분야의 청년정책이 운영되고 있습니다:
// 1. 취업 지원: 취업성공패키지, 청년내일채움공제 등
// 2. 창업 지원: 창업사관학교, 창업패키지 등
// 3. 주거 지원: 청년 전세자금 대출, 매입임대주택 등
// 4. 금융 지원: 학자금 대출 이자 지원, 청년 소득공제 등
// 5. 복지 지원: 청년기본소득, 문화누리카드 등
// 6. 교육 지원: 국가장학금, 평생교육 바우처 등

// 좀 더 구체적인 분야나 상황에 대해 알려주시면 더 자세한 정책 정보를 안내해드릴 수 있습니다. 어떤 분야의 정책에 관심이 있으신가요?`;
//   }
// };
