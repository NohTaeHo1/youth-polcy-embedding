import React, { useRef, useEffect, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import ChatMessage from './ChatMessage';
import { OptionButton } from './OptionButton';
import { useConversationFlow } from '@/hooks/useConversationFlow';
import { Loader2, Camera, Send } from 'lucide-react';
import ProfileInput from './ProfileInput';
import PolicyCard from './PolicyCard';

const ChatInterface = () => {
  const {
    messages,
    options,
    inputDisabled,
    handleSendMessage,
    handleOptionSelect,
    isLoading,
    setInputDisabled
  } = useConversationFlow();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setInputDisabled(false);
  }, [messages]);

  const handleSimulatorClick = () => {
    handleOptionSelect("시뮬레이션");
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <ChatHeader />
      
      {/* 메시지 영역 - 좌우 패딩 추가 */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
        <div className="space-y-3"> {/* 메시지 간 일정한 간격 */}
          {messages.map((msg, index) => {
            // 사용자 메시지
            if (msg.type === 'user') {
              return <ChatMessage key={index} message={msg.content} isUser={true} />;
            }

            // RAG 정책 카드 처리
            if (msg.content && typeof msg.content === 'object' && msg.content.mode === 'rag' && msg.content.policy_detail) {
              return (
                <div key={index} className="space-y-3">
                  {/* 정책 카드 */}
                  <PolicyCard policy={msg.content.policy_detail} />
                  
                  {/* 시뮬레이터 안내 메시지 */}
                  <div className="flex justify-start mb-2 px-0">
                    <div className="flex items-start max-w-[80%]">
                      <img 
                        src="/images/cloud-whale.png" 
                        alt="봇 아이콘" 
                        className="w-12 h-7 mr-2 mt-3 flex-shrink-0" 
                      />
                      <div className="bg-[#DDE9FB] text-gray-900 px-4 py-3 rounded-[20px]">
                        <p className="text-[14px] leading-[18px]">더 정확한 정책 지원을 알아보려면 시뮬레이터를 사용해보세요!</p>
                      </div>
                    </div>
                  </div>

                  {/* 시뮬레이터 버튼 */}
                  <div className="ml-14"> {/* w-12 + mr-2 = 56px ≈ ml-14 */}
                    <button
                      onClick={handleSimulatorClick}
                      className="bg-[#007AFF] hover:bg-[#0056CC] text-white px-4 py-2 rounded-full text-[13px] font-medium flex items-center transition-colors duration-200 shadow-sm"
                    >
                      <span className="mr-2">📊</span>
                      시뮬레이터로 계산하기
                    </button>
                  </div>
                </div>
              );
            }

            // 일반 봇 메시지
            if (msg.type === 'bot') {
              let messageContent;
              if (typeof msg.content === 'object' && msg.content !== null) {
                messageContent = msg.content.content || JSON.stringify(msg.content);
              } else {
                messageContent = msg.content;
              }
              return <ChatMessage key={index} message={messageContent} isUser={false} />;
            }

            return null;
          })}

          {/* 로딩 메시지 */}
          {isLoading && (
            <div className="flex justify-start mb-2 px-0">
              <div className="flex items-start max-w-[80%]">
                <img 
                  src="/images/cloud-whale.png" 
                  alt="봇 아이콘" 
                  className="w-12 h-7 mr-2 mt-3 flex-shrink-0" 
                />
                <div className="bg-[#DDE9FB] text-gray-900 px-4 py-3 rounded-[20px]">
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 text-gray-600 animate-spin mr-2" />
                    <p className="text-[14px] leading-[18px]">지금 생각 중입니다...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* 카메라 버튼 - 이미지 사용 */}
          <button className="w-10 h-10 bg-[#DEE8FB] rounded-full flex items-center justify-center flex-shrink-0">
            <img 
              src="/images/gallery.png" 
              alt="갤러리" 
              className="w-6 h-6 object-contain"
            />
          </button>
          
          {/* 입력창과 전송 버튼 */}
          <div className="flex-1 flex items-center bg-[#DEE8FB] rounded-full px-4 py-2 h-10">
            <input
              type="text"
              placeholder="궁금한 내용을 입력해 주세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              disabled={inputDisabled || isLoading}
              className="flex-1 bg-transparent outline-none text-[14px] placeholder-gray-500 h-full"
            />
            <button
              onClick={handleSend}
              disabled={inputDisabled || isLoading || !input.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center ml-2 disabled:opacity-50 flex-shrink-0"
            >
              <img 
                src="/images/send-2.png" 
                alt="전송" 
                className="w-6 h-6 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
