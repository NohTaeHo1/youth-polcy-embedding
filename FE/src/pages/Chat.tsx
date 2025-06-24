
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
        // 메인 화면으로 직접 이동시킵니다.
        navigate('/main');
        // 또는, 단순히 이전 페이지로 이동하려면 navigate(-1); 을 사용합니다.[6]
    };
  
  return (
    <div className="h-screen w-full bg-[#F8FAFF] flex flex-col items-center">
      {/* 상단 헤더 */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b">
        {/* 뒤로가기 아이콘 (필요시 SVG 또는 lucide-react 아이콘 사용) */}
        <button>
          <img src="/images/arrow-circle-left.png" alt="뒤로가기 아이콘" className="w-6 h-6" onClick={handleGoBack} />
          {/* TODO: 뒤로가기 아이콘 */}
          <span className="sr-only">뒤로가기</span>
        </button>
        <span className="font-bold text-lg">청정서울</span>
        <button>
          {/* TODO: 정보/설정 아이콘 */}
          <img  src="/images/directbox-send.png" alt="정보 아이콘" className="w-6 h-6" />
        </button>
      </div>
      {/* 채팅 인터페이스 */}
      <div className="w-full max-w-md flex-1 flex flex-col bg-transparent">
        <ChatInterface />
      </div>
    </div>
  );
}
export default Chat;
