
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "메시지를 입력하세요" 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-gray-100 rounded-2xl border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-colors">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-grow bg-transparent py-3 px-4 focus:outline-none text-gray-900 placeholder-gray-500"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "mr-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            !message.trim() || disabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-800 text-white hover:bg-gray-900'
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
