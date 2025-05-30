
import React from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChatHeader: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div>
            <h1 className="font-medium text-gray-900">청년정책 AI</h1>
            <p className="text-xs text-green-500">온라인</p>
          </div>
        </div>
        
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
          <MoreHorizontal size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};
