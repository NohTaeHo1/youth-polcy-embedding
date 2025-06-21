import React from 'react';

interface RentInputProps {
  monthlyRent: number;
  deposit: number;
  onMonthlyRentChange: (value: number) => void;
  onDepositChange: (value: number) => void;
}

export const RentInput: React.FC<RentInputProps> = ({
  monthlyRent,
  deposit,
  onMonthlyRentChange,
  onDepositChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          월 소득 (만원)
        </label>
        <input
          type=""
          value={monthlyRent}
          onChange={(e) => onMonthlyRentChange(Number(e.target.value))}
          className="w-full p-3 border border-gray-200 rounded-xl"
          placeholder="250"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          월세 (만원)
        </label>
        <input
          type=""
          value={deposit}
          onChange={(e) => onDepositChange(Number(e.target.value))}
          className="w-full p-3 border border-gray-200 rounded-xl"
          placeholder="60"
        />
      </div>
    </div>
  );
};