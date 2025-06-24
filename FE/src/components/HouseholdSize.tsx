import React from 'react';

interface HouseholdSizeProps {
  value: number;
  onChange: (size: number) => void;
}

export const HouseholdSize: React.FC<HouseholdSizeProps> = ({ value, onChange }) => {
  const sizes = [
    { label: '1인', value: 1 },
    { label: '2인', value: 2 },
    { label: '3인', value: 3 },
    { label: '4인+', value: 4 },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        가구원 수
      </label>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => onChange(size.value)}
            className={`py-2 rounded-xl transition-colors
              ${value === size.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
              }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
};