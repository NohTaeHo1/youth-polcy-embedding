import React, { useRef, useEffect, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import ChatMessage from './ChatMessage';
import { OptionButton } from './OptionButton';
import { useConversationFlow } from '@/hooks/useConversationFlow';
import { Loader2 } from 'lucide-react';
import ProfileInput from './ProfileInput';
import PolicyCard from './PolicyCard'; // 정책 카드 컴포넌트 임포트

const ChatInterface = () => {
  const {
    messages,
    options,
    inputDisabled,
    handleSendMessage,
    handleOptionSelect,
    isLoading
  } = useConversationFlow();

  const { setInputDisabled } = useConversationFlow(); // setInputDisabled가 내려와야 함


  const [input, setInput] = useState(""); // 입력값 상태 추가
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setInputDisabled(false);
    // console.log("useEffect 실행됨, inputDisabled를 false로 변경");
  }, [messages]);

  const handleSimulatorClick = () => {
    // handleOptionSelect 함수를 재활용하여 페이지 이동 로직을 처리합니다.
    handleOptionSelect("시뮬레이션");
  };

  const handleSend = () => {
    if (!input.trim()) return; // 입력값이 비어있으면 전송하지 않음
    handleSendMessage(input);  // 입력값 전달
    setInput("");              // 입력창 비우기
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
    {/* 메시지 영역 */}
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
    {messages.map((msg) => {
      // 1. 사용자 메시지
      if (msg.type === 'user') {
        return (
          <ChatMessage
          key={msg.id}
          message={msg.content}
          isUser={true}
        />
          // <div key={msg.id} className="flex justify-end items-center">
          //   <img src="/images/chat-user.png" alt="user" className="w-6 h-6 mr-2" />
          //   <div /* ... */>
          //     {msg.content}
          //   </div>
          // </div>
        );
      }

      // 2. RAG 정책 카드 처리 (중첩된 구조에 맞게 접근)
      //    msg.content가 존재하고, 그 안의 mode가 'rag'인지 확인합니다.
      if (msg.content && typeof msg.content === 'object' && msg.content.mode === 'rag' && msg.content.policy_detail) {
            return (
              // 부모 div로 카드와 추가 UI를 함께 감싸줍니다.
              <div key={msg.id} className="space-y-2">
                {/* 2-1. 기존 정책 카드 */}
                <div className="flex items-start">
                  <PolicyCard policy={msg.content.policy_detail} />
                </div>

                {/* 2-2. 시뮬레이터 안내 채팅창 (고정 문구) */}
                <div className="flex items-center">
                  <img src="/images/cloud-whale.png" alt="whale" className="w-9 h-5 mr-2" />
                  <div
                    className="rounded-xl px-3 py-1 text-[#2D2D2D] max-w-xs break-words"
                    style={{ background: "#DDE9FB", borderRadius: "12px", padding: "10px" }}
                  >
                    더 정확한 정책 지원을 알아보려면 시뮬레이터를 사용해보세요!
                  </div>
                </div>
                
                {/* 2-3. 시뮬레이터 버튼 */}
                <div className="flex items-start pl-11"> {/* 아이콘 너비만큼 왼쪽 여백 추가 */}
                   <button
                    onClick={handleSimulatorClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                    // 요청하신 스타일: 밝은 회색 배경(#F1F1F1), 진한 회색 글자, 외곽선 없음
                    style={{ backgroundColor: '#F1F1F1', color: '#555555', border: 'none' }}
                  >
                    <img src="/images/calendar-emoji.jpg" alt="시뮬레이터" className="w-4 h-4" />
                    시뮬레이터로 계산하기
                  </button>
                </div>
              </div>
            );
          }

      // 3. LLM 일반 답변 및 그 외 모든 봇 메시지 처리
      if (msg.type === 'bot') {
        let messageContent;
        if (typeof msg.content === 'object' && msg.content !== null) {
          // content 필드가 있으면 그것만 출력
          messageContent = msg.content.content || JSON.stringify(msg.content);
        } else {
          messageContent = msg.content;
        }

        return (
          <div key={msg.id} className="flex items-center">
            <img src="/images/cloud-whale.png" alt="whale" className="w-9 h-5 mr-2" />
            <div
              className="rounded-xl px-3 py-1 text-[#2D2D2D] max-w-xs break-words"
              style={{
                background: "#DDE9FB",
                borderRadius: "12px",
                padding: "10px",
                gap: "8px",
              }}
            >
              {messageContent}
            </div>
          </div>
        );
      }

      // 예외 케이스 처리
      return null;
    })}
      {/* 답변 대기 중일 때 로딩 메시지 */}
      {isLoading && (
        <div className="flex items-center gap-2">
          <img src="/images/cloud-whale.png" alt="whale" className="w-6 h-6" />
          <div className="rounded-xl bg-[#E6F0FA] px-3 py-1 text-[#2D2D2D80]">
            ... 지금 생각 중 입니다
          </div>
          <div className="relative ml-2">
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
      {/* 입력창 */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        {/* 이미지 아이콘 버튼 */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8F0FE]">
          <img
            src="/images/gallery.png"
            alt="이미지 첨부"
            className="w-6 h-6"
            style={{ filter: 'invert(36%) sepia(4%) saturate(0%) hue-rotate(202deg) brightness(93%) contrast(89%)' }}
          />
        </button>
        {/* 입력창 + 전송버튼 감싸는 박스 */}
        <div className="flex flex-1 items-center bg-[#E8F0FE] rounded-full px-3 py-2">
          {console.log('inputDisabled:', inputDisabled, 'isLoading:', isLoading)}
          <input
            className="flex-1 bg-transparent border-none outline-none text-[#6B6C74] placeholder-[#6B6C74] text-sm"
            placeholder="궁금한 내용을 입력해 주세요"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={inputDisabled || isLoading}
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full"
            onClick={handleSend}
            disabled={inputDisabled || isLoading}
          >
            <img
              src="/images/send-2.png"
              alt="전송"
              className="w-5 h-5"
              style={{ filter: 'invert(36%) sepia(4%) saturate(0%) hue-rotate(202deg) brightness(93%) contrast(89%)' }}
            />
            <span className="sr-only">전송</span>
          </button>
        </div>
      </div>
    </div>
  );

};

export default ChatInterface;