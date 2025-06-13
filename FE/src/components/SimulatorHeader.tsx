import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SimulatorHeaderProps {
  title: string;
}

export const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-200">
      <button onClick={() => navigate(-1)} className="mr-3">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
};