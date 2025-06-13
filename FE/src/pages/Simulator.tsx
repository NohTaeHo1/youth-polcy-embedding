import React, { useState } from 'react';
import { SimulatorHeader } from '../components/SimulatorHeader';
import { RentInput } from '../components/RentInput';
import { HouseholdSize } from '../components/HouseholdSize';
import { SimulatorResult } from '../components/SimulatorResult';

const Simulator = () => {
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <SimulatorHeader title="주거지원 계산기" />
      
      <div className="flex-1 p-4 space-y-6">
        <RentInput
          monthlyRent={monthlyRent}
          deposit={deposit}
          onMonthlyRentChange={setMonthlyRent}
          onDepositChange={setDeposit}
        />

        <HouseholdSize
          value={householdSize}
          onChange={setHouseholdSize}
        />

        <button
          onClick={handleCalculate}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-medium"
        >
          분석하기
        </button>

        {showResult && (
          <SimulatorResult
            monthlyRent={monthlyRent}
            deposit={deposit}
            householdSize={householdSize}
          />
        )}
      </div>
    </div>
  );
};

export default Simulator;