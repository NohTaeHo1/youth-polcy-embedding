const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  if (isUser) {
    // 사용자 메시지: 오른쪽 정렬, 파란색 배경
    return (
      <div className="flex justify-end mb-2 px-4">
        <div className="flex items-start max-w-[80%]">
          <div className="bg-[#2A6FD4] text-white px-4 py-2.5 rounded-[20px]">
            <p className="text-[14px] leading-[18px]">{message}</p>
          </div>
          <img 
            src="/images/chat-user.png" 
            alt="사용자 아이콘" 
            className="w-12 h-12 ml-2 mt-3 flex-shrink-0" 
          />
        </div>
      </div>
    );
  } else {
    // 봇 메시지: 왼쪽 정렬, 회색 배경, 이미지 아바타
    return (
      <div className="flex justify-start mb-2 px-0">
        <div className="flex items-start max-w-[85%]">
          {/* 봇 아바타 - 이미지만 사용 */}
          <img 
            src="/images/cloud-whale.png" 
            alt="봇 아이콘" 
            className="w-12 h-7 mr-2 mt-3 flex-shrink-0" 
          />
          {/* 메시지 */}
          <div className="bg-[#DDE9FB] text-gray-900 px-4 py-2.5 rounded-[20px]">
            <p className="text-[14px] leading-[18px]">{message}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatMessage;