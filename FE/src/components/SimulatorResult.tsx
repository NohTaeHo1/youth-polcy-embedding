import React from 'react';
import { SimulatorFormData, PolicyResult } from '../../types/conversation';


interface SimulatorResultProps {
  monthlyRent: number;
  deposit: number;
  householdSize: number;
}

export const SimulatorResult: React.FC<SimulatorResultProps> = ({
  monthlyRent,
  deposit,
  householdSize,
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="bg-green-50 p-4 rounded-xl">
        <div className="flex items-center mb-2">
          <span className="text-green-600">✓</span>
          <span className="ml-2 font-medium">지원 가능한 정책</span>
        </div>
        <div className="text-lg font-bold">3개 정책 매칭</div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h3 className="font-medium">서울시 청년 월세 지원</h3>
          <p className="text-sm text-gray-600 mt-1">
            월 18만원 지원 (12개월)
            <br />
            총 216만원 지원 가능
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h3 className="font-medium">주거급여</h3>
          <p className="text-sm text-gray-600 mt-1">
            월 15만원 지원
            <br />
            임차급여 지원
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h3 className="font-medium">청년 전월세 보증금 대출</h3>
          <p className="text-sm text-gray-600 mt-1">
            최대 7,000만원 지원
          </p>
        </div>
      </div>
    </div>
  );
};