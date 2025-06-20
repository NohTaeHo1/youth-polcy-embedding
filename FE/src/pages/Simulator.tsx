// /pages/Simulator.tsx 파일 전체를 이 코드로 교체하세요.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, FileText, Bot, User } from 'lucide-react';

// --- 상태 및 타입 정의 ---
type Tab = '주거지원' | '교육지원';
type HouseholdSize = '1인' | '2인' | '3인' | '4인+';
type LivingArrangement = '분리 거주' | '동거';

// --- 메인 시뮬레이터 컴포넌트 ---
const Simulator = () => {
  // --- 상태 관리 ---
  const [activeTab, setActiveTab] = useState<Tab>('주거지원');
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');
  const [householdSize, setHouseholdSize] = useState<HouseholdSize>('1인');
  const [livingWithParents, setLivingWithParents] = useState<LivingArrangement>('분리 거주');

  const [showResult, setShowResult] = useState(false);
  const [resultAmount, setResultAmount] = useState(180); // 예시 결과값

  const navigate = useNavigate();

  // --- 이벤트 핸들러 ---
  const handleCalculate = () => {
    // 실제로는 여기서 API 호출 또는 복잡한 계산을 수행합니다.
    console.log({
      income,
      rent,
      householdSize,
      livingWithParents,
    });
    // 결과 표시를 위한 상태 업데이트
    setShowResult(true);
  };

  const handleGoToResultPage = () => {
    // ★★★ 3. 상세 결과 페이지로 전달할 가상 데이터를 만듭니다. ★★★
    // 실제로는 API 호출 등을 통해 이 데이터를 받아옵니다.
    const simulationResults = [
      { id: 1, title: '역세권청년주택', details: ['연 12만원 지원', '만 19~39세', '소득기준 120% 이하'] },
      { id: 2, title: '청년 임차보증금 이자지원', details: ['대출한도 최대 2억원', '만 19~39세', '연소득 5천만원 이하'] },
      { id: 3, title: '청년 부동산 중개보수 및 이사비 지원', details: ['최대 40만원 지원', '만 19~39세', '연소득 5천만원 이하'] },
    ];
        // ★★★ 4. state를 통해 결과 데이터를 전달하며 페이지를 이동합니다. ★★★
    navigate('/SimulatorResults', { state: { results: simulationResults } });
  };
  // --- UI 렌더링 ---
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 1. 헤더 */}
      <header className="flex items-center p-4 border-b">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg -ml-10">
          청정서울
        </h1>
      </header>

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
        {/* 입력 폼 */}
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

        {/* 버튼 그룹 */}
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
      <footer className="p-6 bg-white">
        {showResult ? (
          // 결과 표시
          <div className="space-y-4">
            <div 
              className="flex items-center justify-center gap-4 p-4 rounded-xl" 
              style={{ backgroundColor: '#F3F4FD' }}
            >
              <div>
                {/* ★★★ 수정된 부분: 텍스트 앞에 '▲' 유니코드 문자를 추가합니다. ★★★ */}
                <p className="text-sm text-blue-600 font-semibold">▲ 예상 지원금</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{resultAmount.toLocaleString()}만원</p>
              </div>
            </div>
            <button
              onClick={handleGoToResultPage} // <-- 이 버튼에 위 함수가 연결됩니다.
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition"
            >
              상세 결과 보러가기
            </button>
          </div>
        ) : (
          // 분석 요청 버튼
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition"
          >
            AI 분석 요청하기
          </button>
        )}
      </footer>

      {/* 5. 하단 네비게이션 바 */}
      <BottomNavBar />
    </div>
  );
};

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
          className={`flex-1 py-3 rounded-xl font-medium transition ${
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

const BottomNavBar = () => (
  <nav className="grid grid-cols-4 border-t py-2">
    <NavItem icon={<Home size={24} />} label="Home" />
    <NavItem icon={<FileText size={24} />} label="청년 정책" />
    <NavItem icon={<Bot size={24} />} label="AI 상담" isActive />
    <NavItem icon={<User size={24} />} label="마이페이지" />
  </nav>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean }> = ({ icon, label, isActive }) => (
  <button className={`flex flex-col items-center justify-center space-y-1 transition ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

export default Simulator;

