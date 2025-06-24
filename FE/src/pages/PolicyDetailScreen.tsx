import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { policies } from "../data/policies";

const PolicyDetailScreen = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 id 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const policyId = id ? parseInt(id, 10) : (state?.id ? parseInt(state.id as string, 10) : 0);
  const policy = policies.find(p => p.id === String(policyId)) || { title: "Unknown Policy", status: "", statusColor: "gray", category: "", summary: "", details: { 자격: [], 내용: [], 일정: [] } };

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 하단 네비게이션 핸들러
  const handleStartHome = () => navigate('/main');
  const handleStartPolicyList = () => navigate('/policy');
  const handleStartSimulator = () => navigate('/simulator');
  const handleStartChat = () => navigate('/chat');

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 - 첫 번째 이미지 참고 (검색창 포함) */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2">
            <img src="/images/arrow-circle-left.png" alt="뒤로가기" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">청정서울</h1>
          <div className="w-6 h-6"></div> {/* 더보기 버튼 대신 공간 확보 */}
        </div>
        <div className="mt-2">
          <input
            type="text"
            placeholder="정책명, 키워드, 기관명 등으로 검색"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
      </div>

      {/* 메인 컨텐츠 - 첫 번째 이미지의 카드 스타일 적용 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {policyId && policy.title !== "Unknown Policy" ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-base text-gray-900">{policy.title}</h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${policy.statusColor === "blue" ? "bg-blue-100 text-blue-600 border-blue-200" : policy.statusColor === "red" ? "bg-red-100 text-red-600 border-red-200" : policy.statusColor === "green" ? "bg-green-100 text-green-600 border-green-200" : "bg-gray-200 text-gray-500 border-gray-300"}`}>
                  {policy.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 whitespace-pre-line leading-snug">
                <p><strong>카테고리:</strong> {policy.category}</p>
                <p><strong>요약:</strong> {policy.summary}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-4">
              <h3 className="font-semibold mb-2">신청 자격</h3>
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {policy.details.자격.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-4">
              <h3 className="font-semibold mb-2">지원 내용</h3>
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {policy.details.내용.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-4">
              <h3 className="font-semibold mb-2">신청 일정</h3>
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {policy.details.일정.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <button
              className="w-full py-3 bg-[#111F42] text-white text-[16px] font-semibold rounded-xl shadow-md hover:bg-[#1D4ED8] transition-colors mb-4"
              onClick={() => window.open("https://www.seoul.go.kr/", "_blank")}
            >
              지금 바로 신청하기
            </button>
            <button
              className="w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg"
              onClick={() => navigate('/policy')}
            >
              목록으로 돌아가기
            </button>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">Oops! Page not found</p>
            <a href="/" className="text-blue-500 underline">Return to Home</a>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 - 첫 번째 이미지 참고 */}
      <div className="h-20 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
        <div className="flex justify-around items-center pt-4">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartHome}>
            <img
              src="/images/홈.svg"
              alt="홈 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartPolicyList}>
            <img
              src="/images/청년정책.svg"
              alt="청년정책 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-600 mt-1">청년 정책</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartSimulator}>
            <img
              src="/images/시뮬레이터.svg"
              alt="시뮬레이터 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">시뮬레이터</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartChat}>
            <img
              src="/images/챗봇.svg"
              alt="챗봇 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">AI 상담</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailScreen;