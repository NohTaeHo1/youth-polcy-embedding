import React from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChatHeader: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      {/* 뒤로가기 버튼 */}
      <button onClick={handleBack} className="p-2 -ml-2">
        <img src='images/arrow-circle-left.png' alt="뒤로가기" className="w-6 h-6" />
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
        <img src='images/directbox-send.png' alt="더보기" className="w-6 h-6" />
      </button>
    </div>
  );
};
