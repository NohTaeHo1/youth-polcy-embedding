// /pages/SimulatorResults.tsx 파일을 새로 만들고 아래 코드를 붙여넣으세요.

import React, { useState } from 'react';
// ★★★ 1. 데이터 수신을 위해 useLocation 훅을 import 합니다. ★★★
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, FileText, Bot, User } from 'lucide-react';

// --- 타입 정의 ---
interface PolicyResult {
  id: number;
  title: string;
  details: string[];
}

// --- 메인 상세 결과 페이지 컴포넌트 ---
const SimulatorResults = () => {
  const [activeTab, setActiveTab] = useState<'주거지원' | '교육지원'>('주거지원');
  const navigate = useNavigate();
  
  // ★★★ 2. 이전 페이지에서 보낸 데이터를 수신합니다. ★★★
  const location = useLocation();
  const results: PolicyResult[] = location.state?.results || []; // 데이터가 없으면 빈 배열

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center p-4 border-b bg-white">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg -ml-10">
          청정서울
        </h1>
      </header>

      {/* 탭 메뉴 */}
      <nav className="flex bg-white">
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

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="font-bold text-gray-800">AI 분석 결과</h2>
        
        {/* 상단 결과 배너 */}
        <div className="w-full text-center py-3 px-4 rounded-xl text-white font-semibold" style={{backgroundColor: '#1E3A8A'}}>
          지금 바로 신청 가능한 정책 {results.length}개
        </div>
        
        {/* ★★★ 3. 받아온 데이터를 기반으로 정책 카드를 렌더링합니다. ★★★ */}
        {results.map((policy) => (
          <PolicyResultCard key={policy.id} policy={policy} />
        ))}
      </main>
      
      {/* 하단 네비게이션 바 */}
      <BottomNavBar />
    </div>
  );
};


// --- 하위 컴포넌트들 ---

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-center font-semibold transition ${
      isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
    }`}
  >
    {title}
  </button>
);

const PolicyResultCard: React.FC<{ policy: PolicyResult }> = ({ policy }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-gray-800">{policy.title}</h3>
      <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
        신청
      </button>
    </div>
    <ul className="space-y-1">
      {policy.details.map((detail, index) => (
        <li key={index} className="text-sm text-gray-500">
          • {detail}
        </li>
      ))}
    </ul>
  </div>
);

const BottomNavBar = () => (
  <nav className="grid grid-cols-4 border-t py-2 bg-white">
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

export default SimulatorResults;
