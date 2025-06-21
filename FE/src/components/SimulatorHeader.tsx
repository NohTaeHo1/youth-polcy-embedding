import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SimulatorHeaderProps {
  title: string;
}

export const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      {/* 뒤로가기 버튼 */}
      <button onClick={handleBack} className="p-2">
        <img src="/images/arrow-circle-left.png" alt="뒤로가기" className="w-6 h-6" />
      </button>
      
      {/* 중앙 타이틀 - props로 받은 title 사용 */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      
      {/* 빈 공간 (대칭을 위해) */}
      <div className="w-10"></div>
    </div>
  );
};
