import React from 'react';
import { SimulatorHeader } from '../components/SimulatorHeader';
import { useNavigate } from 'react-router-dom';

interface SimulatorResultProps {
  monthlyRent: number;
  deposit: number;
  householdSize: number;
}

export const SimulatorResult: React.FC<SimulatorResultProps> = ({
  monthlyRent,
  deposit,
  householdSize,
}) => {
  const navigate = useNavigate();

  // 네비게이션 핸들러 함수들
  const handleStartHome = () => {
    navigate('/');
  };

  const handleStartPolicyList = () => {
    navigate('/policy-list');
  };

  const handleStartSimulator = () => {
    navigate('/simulator');
  };

  const handleStartChat = () => {
    navigate('/chat');
  };
  const handlePolicyDetail = (id: number) => {
    navigate(`/policy/${id}`, { state: { id } }); // Use numeric ID in the path
  };
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <SimulatorHeader title="청정서울" />
      
      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200">
        <button className="flex-1 py-3 text-center text-[16px] font-semibold text-blue-600 border-b-2 border-blue-600">
          주거지원 계산기
        </button>
        <button className="flex-1 py-3 text-center text-[16px] font-semibold text-gray-400">
          교육지원 계산기
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* AI 분석 결과 헤더 */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h2 className="text-[18px] font-semibold text-gray-900">AI 분석 결과</h2>
          {/* Props 사용 예시 */}
          {/* <div className="mt-2 text-sm text-gray-600">
            <p>월세: {monthlyRent.toLocaleString()}원</p>
            <p>보증금: {deposit.toLocaleString()}원</p>
            <p>가구원 수: {householdSize}명</p>
          </div> */}
        </div>

        {/* 지금 바로 신청 가능한 정책 버튼 */}
        <div className="px-4 py-4">
          <button className="w-full bg-[#111F42] text-white text-[16px] font-semibold py-4 rounded-xl shadow-md hover:bg-[#1D4ED8] transition-colors">
            📢 지금 바로 신청 가능한 정책 3개
          </button>
        </div>

        {/* 정책 리스트 */}
        <div className="px-4 pb-6 space-y-3">
          {/* 역세권청년주택 */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-[16px] font-semibold text-gray-900 leading-tight flex-1 pr-3">역세권청년주택</h3>
              <button className="bg-blue-100 text-[#2563EB] px-4 py-1 rounded-full text-[14px] font-semibold border border-blue-200 flex-shrink-0" onClick={() => handlePolicyDetail(1)}>
                신청
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] text-gray-600 leading-relaxed">• 연 12만원 지원</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">• 만 19~39세</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">• 소득기준 120% 이하</p>
            </div>
          </div>

          {/* 청년 임차보증금 이자지원 */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-[16px] font-semibold text-gray-900 leading-tight flex-1 pr-3">청년 임차보증금 이자지원</h3>
              <button className="bg-blue-100 text-[#2563EB] px-4 py-1 rounded-full text-[14px] font-semibold border border-blue-200 flex-shrink-0">
                신청
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] text-gray-600 leading-relaxed">• 대출한도 최대 2억원</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">• 만 19~39세</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">• 연소득 5천만원 이하</p>
            </div>
          </div>

          {/* 청년 부동산 중개보수 및 이사비 지원 */}
          <div className="bg-white rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-[16px] font-semibold text-gray-900 leading-tight flex-1 pr-3">청년 부동산 중개보수 및 이사비 지원</h3>
              <button className="bg-blue-100 text-[#2563EB] px-4 py-1 rounded-full text-[14px] font-semibold border border-blue-200 flex-shrink-0">
                신청
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] text-gray-600 leading-relaxed">• 최대 40만원 지원</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">• 만 19~39세</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">• 연소득 5천만원 이하</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="h-20 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
        <div className="flex justify-around items-center pt-4">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartHome}>
            <img
              src="/images/홈.svg"
              alt="홈 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-blue-600 mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartPolicyList}>
            <img
              src="/images/청년정책.svg"
              alt="청년정책 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">청년 정책</span>
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

export default SimulatorResult;
