
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CharacterImage from './CharacterImage';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end mb-2`}>
      {/* AI 아이콘 */}
      {!isUser && (
        <img
          src="/images/cloud-whale.png" // AI 아이콘 경로
          alt="AI"
          className="w-14 h-10 mr-4 object-contain aspect-square"
        />
      )}
      {/* 말풍선 */}
      <div
        className={`rounded-2xl px-4 py-2 text-sm shadow
          ${isUser
            ? 'bg-[#2A6FD4] text-white border border-[#E8EAF2]'
            : 'bg-[#DDE9FB] text-[#2D2D2D] border border-[#E8EAF2]'}
          max-w-[70%]`}
      >
        {message}
      </div>
      {/* 사용자 아이콘 */}
      {isUser && (
        <img
          src="/images/chat-user.png" // 사용자 아이콘 경로
          alt="나"
          className="w-8 h-8 ml-2"
        />
      )}
    </div>
  );
  // return (
  //   <div className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
  //     <Avatar className="w-8 h-8 flex-shrink-0">
  //       {isUser ? (
  //         <>
  //           <AvatarImage src="/lovable-uploads/user-avatar.png" />
  //           <AvatarFallback className="bg-blue-500 text-white text-sm">나</AvatarFallback>
  //         </>
  //       ) : (
  //         <div className="w-8 h-8 rounded-full overflow-hidden bg-pink-100 flex items-center justify-center">
  //           <CharacterImage
  //             src="/lovable-uploads/8f18f18f-0a9f-4c5e-b2ba-a0077eb98bc3.png"
  //             alt="AI 캐릭터"
  //             className="w-6 h-6 object-contain"
  //           />
  //         </div>
  //       )}
  //     </Avatar>
      
  //     <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
  //       <div
  //         className={`inline-block p-3 rounded-2xl text-sm leading-relaxed ${
  //           isUser
  //             ? 'bg-blue-500 text-white rounded-br-md'
  //             : 'bg-gray-100 text-gray-800 rounded-bl-md'
  //         }`}
  //       >
  //         {message.split('\n').map((line, index) => (
  //           <React.Fragment key={index}>
  //             {line}
  //             {index < message.split('\n').length - 1 && <br />}
  //           </React.Fragment>
  //         ))}
  //       </div>
  //       <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
  //         {timestamp.toLocaleTimeString('ko-KR', { 
  //           hour: '2-digit', 
  //           minute: '2-digit' 
  //         })}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ChatMessage;
