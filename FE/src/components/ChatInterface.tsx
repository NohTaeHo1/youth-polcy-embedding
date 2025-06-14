
// import React, { useRef, useEffect } from 'react';
// import { ChatHeader } from './ChatHeader';
// import ChatMessage from './ChatMessage';
// import { MessageInput } from './MessageInput';
// import { OptionButton } from './OptionButton';
// import { UserProfileCollection } from './UserProfileCollection';
// import { useConversationFlow } from '@/hooks/useConversationFlow';
// import { Loader2 } from 'lucide-react';
// import ProfileInput from './ProfileInput';


// const ChatInterface = () => {
//   const {
//     messages,
//     options,
//     inputDisabled,
//     handleSendMessage,
//     handleOptionSelect,
//     currentStep,
//     isLoading
//   } = useConversationFlow();

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-full bg-white">
//       <ChatHeader />
      
//       <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
//         {messages.map((msg) => (
//           <ChatMessage 
//             key={msg.id} 
//             message={typeof msg.content === 'string' ? msg.content : ''} 
//             isUser={msg.type === 'user'} 
//             timestamp={msg.timestamp} 
//           />
//         ))}
        
//         {isLoading && (
//           <div className="flex items-center justify-center py-4">
//             <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//             <span className="ml-2 text-gray-600">답변을 생성하고 있습니다...</span>
//           </div>
//         )}
        
//         {/* Show user profile collection step */}
//         {/* {currentStep === 'COLLECT_USER_PROFILE' && (
//           <UserProfileCollection onComplete={handleSendMessage} />
//         )} */}
        
//         {/* Show option buttons */}
//         {options.length > 0 && !isLoading && (
//           <div className="space-y-2">
//             {options.map((option, index) => (
//               <OptionButton
//                 key={index}
//                 text={option}
//                 onClick={() => handleOptionSelect(option)}
//               />
//             ))}
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {!inputDisabled && (
//         <div className="p-4 border-t border-gray-100">
//           {/* <MessageInput
//             onSendMessage={handleSendMessage}
//             disabled={isLoading}
//             placeholder="메시지를 입력하세요..."
//           /> */}
//           <ProfileInput
//           onSubmit={({ age, region, category, query }) => {
//           // handleSendMessage가 (message, profile?) 형태라면 아래처럼
//           handleSendMessage(query, { age, region, category });
//         }}
//         disabled={isLoading || inputDisabled}
//       />
//       </div>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;
import React, { useRef, useEffect, useState } from 'react';
import { ChatHeader } from './ChatHeader';
import ChatMessage from './ChatMessage';
import { OptionButton } from './OptionButton';
import { useConversationFlow } from '@/hooks/useConversationFlow';
import { Loader2 } from 'lucide-react';
import ProfileInput from './ProfileInput';

const ChatInterface = () => {
  const {
    messages,
    options,
    inputDisabled,
    handleSendMessage,
    handleOptionSelect,
    isLoading
  } = useConversationFlow();

  const [input, setInput] = useState(""); // 입력값 상태 추가
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
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
          // RAG에서 온 정책카드라면
          if (msg.type === 'policyCard' && msg.source === 'RAG' && msg.policy_detail) {
            return (
              <PolicyCard
                key={msg.id}
                policy={msg.policy_detail}
              />
            );
          }
          // LLM에서 온 메시지거나 일반 메시지라면
          return (
            <ChatMessage
              key={msg.id}
              message={msg.content}
              isUser={msg.type === 'user'}
              timestamp={msg.timestamp}
            />
          );
})}
        {/* 정책 카드 메시지 예시 */}
        {/* 
        <PolicyCard
          title="서울시 청년 월세 지원"
          details={[
            "월 최대 20만원 지원",
            "만 19~39세 대상",
            "소득기준: 중위소득 150% 이하"
          ]}
          onDetailClick={() => {}}
        />
        */}
        {/* 시뮬레이터 버튼 메시지 예시 */}
        {/* 
        <SimulatorButton onClick={() => {}} />
        */}
        <div ref={messagesEndRef} />
      </div>
      {/* 입력창 */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        {/* 이미지 아이콘 버튼 */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8F0FE]">
          <img
            src="/images/gallery.png" // public/images/image-icon.png
            alt="이미지 첨부"
            className="w-6 h-6"
            style={{ filter: 'invert(36%) sepia(4%) saturate(0%) hue-rotate(202deg) brightness(93%) contrast(89%)' }}
          />
        </button>
        {/* 입력창 + 전송버튼 감싸는 박스 */}
        <div className="flex flex-1 items-center bg-[#E8F0FE] rounded-full px-3 py-2">
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
  // return (
  //   <div className="flex flex-col h-full bg-white">
  //     <ChatHeader />
  //     <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
  //       {messages.map((msg) => (
  //         <ChatMessage
  //           key={msg.id}
  //           message={typeof msg.content === 'string' ? msg.content : ''}
  //           isUser={msg.type === 'user'}
  //           timestamp={msg.timestamp}
  //         />
  //       ))}

  //       {isLoading && (
  //         <div className="flex items-center justify-center py-4">
  //           <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
  //           <span className="ml-2 text-gray-600">답변을 생성하고 있습니다...</span>
  //         </div>
  //       )}

  //       {options.length > 0 && !isLoading && (
  //         <div className="space-y-2">
  //           {options.map((option, index) => (
  //             <OptionButton
  //               key={index}
  //               text={option}
  //               onClick={() => handleOptionSelect(option)}
  //             />
  //           ))}
  //         </div>
  //       )}

  //       <div ref={messagesEndRef} />
  //     </div>

  //     {!inputDisabled && (
  //       <div className="p-4 border-t border-gray-100">
  //         <ProfileInput
  //           onSubmit={({ age, region, category, query }) => {
  //             handleSendMessage(query, { age, region, category });
  //           }}
  //           disabled={isLoading || inputDisabled}
  //         />
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ChatInterface;