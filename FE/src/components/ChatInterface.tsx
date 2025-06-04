
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
import React, { useRef, useEffect } from 'react';
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={typeof msg.content === 'string' ? msg.content : ''}
            isUser={msg.type === 'user'}
            timestamp={msg.timestamp}
          />
        ))}

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">답변을 생성하고 있습니다...</span>
          </div>
        )}

        {options.length > 0 && !isLoading && (
          <div className="space-y-2">
            {options.map((option, index) => (
              <OptionButton
                key={index}
                text={option}
                onClick={() => handleOptionSelect(option)}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!inputDisabled && (
        <div className="p-4 border-t border-gray-100">
          <ProfileInput
            onSubmit={({ age, region, category, query }) => {
              handleSendMessage(query, { age, region, category });
            }}
            disabled={isLoading || inputDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;