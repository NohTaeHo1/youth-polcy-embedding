
import React from 'react';

interface OptionButtonProps {
  text: string;
  onClick: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 py-3 px-4 rounded-xl text-left transition-colors font-medium"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
