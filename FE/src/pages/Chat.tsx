
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md h-full bg-white shadow-xl">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
