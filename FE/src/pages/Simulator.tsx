import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, FileText, Bot, User } from 'lucide-react';

// --- 상태 및 타입 정의 ---
type Tab = '주거지원' | '교육지원';
type HouseholdSize = '1인' | '2인' | '3인' | '4인+';
type LivingArrangement = '분리 거주' | '동거';

// --- 하위 컴포넌트들 ---
const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-center font-semibold transition ${
      isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'
    }`}
  >
    {title}
  </button>
);

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

const ButtonGroup: React.FC<{ label: string; options: string[]; selectedValue: string; onSelect: (value: string) => void }> = ({ label, options, selectedValue, onSelect }) => (
  <div className="space-y-3">
    <label className="font-semibold text-gray-700">{label}</label>
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`flex-1 py-3 rounded-full font-medium transition ${
            selectedValue === option
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

// --- 메인 시뮬레이터 컴포넌트 ---
const Simulator = () => {
  const navigate = useNavigate();
  
  // --- 상태 관리 ---
  const [activeTab, setActiveTab] = useState<Tab>('주거지원');
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');
  const [householdSize, setHouseholdSize] = useState<HouseholdSize>('1인');
  const [livingWithParents, setLivingWithParents] = useState<LivingArrangement>('분리 거주');
  const [showResult, setShowResult] = useState(false);
  const [resultAmount, setResultAmount] = useState(53);

  // --- 이벤트 핸들러 ---
  const handleBack = () => {
    navigate(-1);
  };

  const handleCalculate = () => {
    console.log({
      income,
      rent,
      householdSize,
      livingWithParents,
    });
    setShowResult(true);
  };

  const handleGoToResultPage = () => {
    const simulationResults = [
      { id: 1, title: '역세권청년주택', details: ['연 12만원 지원', '만 19~39세', '소득기준 120% 이하'] },
      { id: 2, title: '청년 임차보증금 이자지원', details: ['대출한도 최대 2억원', '만 19~39세', '연소득 5천만원 이하'] },
      { id: 3, title: '청년 부동산 중개보수 및 이사비 지원', details: ['최대 40만원 지원', '만 19~39세', '연소득 5천만원 이하'] },
    ];
    navigate('/SimulatorResults', { state: { results: simulationResults } });
  };

  const handleStartChat = () => {
    navigate('/chat'); // ChatScreen으로 이동
    };

  const handelStartPolicyList = () => {
      navigate('/policy'); // PolicyListScreen으로 이동
      };

  const handleStartSimulator = () => {
      navigate('/simulator'); // SimulatorScreen으로 이동
  };

  const handelStartHome = () => {
      navigate('/main'); // HomeScreen으로 이동
  }

  // --- UI 렌더링 ---
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 1. 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        {/* 뒤로가기 버튼 */}
        <button onClick={handleBack} className="p-2 -ml-2">
          <img src="images/arrow-circle-left.png" alt="뒤로가기" className="w-6 h-6" />
        </button>
        
        {/* 중앙 타이틀 */}
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-semibold text-gray-900">청정서울</h1>
          <div className="flex items-center mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-green-600 font-medium">온라인</span>
          </div>
        </div>
        
        {/* 더보기 버튼 */}
        <button className="p-2 -mr-2">
          <img src="images/directbox-send.png" alt="더보기" className="w-6 h-6" />
        </button>
      </div>

      {/* 2. 탭 메뉴 */}
      <nav className="flex">
        <TabButton
          title="주거지원 계산기"
          isActive={activeTab === '주거지원'}
          onClick={() => setActiveTab('주거지원')}
        />
        <TabButton
          title="교육지원 계산기"
          isActive={activeTab === '교육지원'}
          onClick={() => setActiveTab('교육지원')}
        />
      </nav>

      {/* 3. 메인 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <InputGroup label="월 소득 (만원)">
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="월 소득을 입력해주세요"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </InputGroup>

        <InputGroup label="월세 (만원)">
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder="월세를 입력해주세요"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </InputGroup>

        <ButtonGroup
          label="가구원 수"
          options={['1인', '2인', '3인', '4인+']}
          selectedValue={householdSize}
          onSelect={(val) => setHouseholdSize(val as HouseholdSize)}
        />
        <ButtonGroup
          label="부모님과 동거 여부"
          options={['분리 거주', '동거']}
          selectedValue={livingWithParents}
          onSelect={(val) => setLivingWithParents(val as LivingArrangement)}
        />
      </main>

      {/* 4. 하단 버튼 및 결과 영역 */}
      <div className="p-6 bg-white">
        {showResult ? (
          <div className="space-y-4">
            {/* 예상 지원금 카드 */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.08)] border border-gray-100">
              <div className="text-center">
                {/* 상단 아이콘과 텍스트 */}
                <div className="flex items-center justify-center bg-[#ECF1FE] mb-3 rounded-t-2xl py-3">
                  <span className="text-lg mr-2">💰</span>
                  <span className="text-sm text-gray-600 font-medium">예상 지원금</span>
                </div>
                
                {/* 금액 표시 */}
                <div className="mb-4">
                  <p className="text-4xl font-bold text-blue-600 mb-1">{resultAmount.toLocaleString()}만원</p>
                </div>
                
                {/* 구분선 */}
                <div className="w-full h-px bg-gray-200"></div>
                
                {/* 하단 안내 텍스트 */}
                <p className="text-xs text-gray-500 leading-relaxed py-4">
                  위 금액은 예상 지원금으로 실제 지원금과<br />
                  다를 수 있습니다.
                </p>
              </div>
            </div>
            
            {/* 상세 결과 버튼 */}
            <button
              onClick={handleGoToResultPage}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-full hover:bg-blue-700 transition"
            >
              상세 결과 보러가기
            </button>
          </div>
        ) : (
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-full hover:bg-blue-700 transition"
          >
            AI 분석 요청하기
          </button>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="h-20 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
        <div className="flex justify-around items-center pt-4" onClick={handelStartHome}>
          <div className="flex flex-col items-center">
            <img
              src="/images/홈.svg"
              alt="홈 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-s text-blue-600 mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center" onClick={handelStartPolicyList}>
            <img
              src="/images/청년정책.svg"
              alt="청년정책 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-s text-gray-400 mt-1">청년 정책</span>
          </div>
          <div className="flex flex-col items-center" onClick={handleStartSimulator}>
            <img
              src="/images/시뮬레이터.svg"
              alt="시뮬레이터 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-s text-gray-400 mt-1">시뮬레이터</span>
          </div>
          <div className="flex flex-col items-center" onClick={handleStartChat}>
            <img
              src="/images/챗봇.svg"
              alt="챗봇 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-s text-gray-400 mt-1">AI 상담</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
