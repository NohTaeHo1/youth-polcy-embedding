import type { PolicyDetail } from "../components/PolicyCard";
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
    // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const API_URL = "http://localhost:8000";
    const response = await fetch(`${API_URL}/llm/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("정책 정보를 가져오는데 실패했습니다.");
    const data = await response.json();
    console.log("BE 응답 data:", data);
    if (data.mode === "rag" && data.policy_details) {
      // RAG 카드 응답 (단일 정책)
      return formatPolicyResults([data.policy_details]); // 배열로 감싸서 전달
    } else if (data.mode === "llm" && data.llm_response) {
      // LLM 텍스트 응답
      return data.llm_response;
    } else if (data.results) {
      // 검색 결과 카드 배열
      return formatPolicyResults([data.results]);
    } else {
      return "죄송합니다. 정책 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  } catch (error) {
    console.error("정책 정보 생성 오류:", error);
    toast.error("정책 정보를 가져오는데 문제가 발생했습니다.");
    return "죄송합니다. 정책 정보를 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};


// 결과 포맷팅 함수
const formatPolicyResults = (results: any[]): PolicyDetail[] => {
  console.log("포맷팅할 정책 결과:", results);
  if (!results || results.length === 0) return [];

  return results.map((policy) => ({
    plcyNm: policy.plcyNm,
    plcyExplnCn: policy.plcyExplnCn,
    plcySprtCn: policy.plcySprtCn,
    aplyYmd: policy.aplyYmd,
    plcyAplyMthdCn: policy.plcyAplyMthdCn,
    clsfNm: policy.clsfNm,
    sprtTrgtMinAge: policy.sprtTrgtMinAge,
    sprtTrgtMaxAge: policy.sprtTrgtMaxAge,
    rgtrInstCdNm: policy.rgtrInstCdNm,
    etcMttrCn: policy.etcMttrCn,
    addAplyQlfcCndCn: policy.addAplyQlfcCndCn,
    refUrlAddr1: policy.refUrlAddr1,
  }));
};

