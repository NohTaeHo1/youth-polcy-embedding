import React from 'react';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
}

const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  
    if (isUser) {
        // 사용자 메시지: 오른쪽 정렬, [말풍선][아이콘] 순서
        return (
            <div className="w-full flex justify-end mb-4">
                <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="bg-[#2A6FD4] text-white rounded-2xl rounded-br-none px-4 py-3 text-sm shadow-sm">
                        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
                    </div>
                    <img
                        src="/images/chat-user.png"
                        alt="나"
                        className="w-8 h-8 object-contain flex-shrink-0"
                    />
                </div>
            </div>
        );
    }
    // AI 메시지: 왼쪽 정렬, [아이콘][말풍선] 순서
    return (
        <div className="w-full flex justify-start mb-4">
            <div className="flex items-end gap-2 max-w-[80%]">
                <img
                    src="/images/cloud-whale.png"
                    alt="AI"
                    className="w-10 h-10 object-contain self-start flex-shrink-0"
                />
                <div className="bg-[#DDE9FB] text-[#2D2D2D] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm text-sm">
                    <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
