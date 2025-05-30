
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserProfileCollectionProps {
  onComplete: (profileData: string) => void;
}

interface ProfileData {
  age: string;
  location: string;
  situation: string;
}

export const UserProfileCollection: React.FC<UserProfileCollectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    age: '',
    location: '',
    situation: ''
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete profile collection
      const profileText = `나이: ${profileData.age}세, 지역: ${profileData.location}, 상황: ${profileData.situation}`;
      onComplete(profileText);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profileData.age.trim() !== '';
      case 2:
        return profileData.location.trim() !== '';
      case 3:
        return profileData.situation.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 mx-2">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          맞춤형 정책 추천을 위한 정보 입력
        </h3>
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full ${
                i <= step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {step}/3 단계: {
            step === 1 ? '나이 정보' :
            step === 2 ? '거주 지역' :
            '현재 상황'
          }
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
              나이를 입력해주세요
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="예: 25"
              value={profileData.age}
              onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              거주 지역을 입력해주세요
            </Label>
            <Input
              id="location"
              placeholder="예: 서울특별시 강남구"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="situation" className="text-sm font-medium text-gray-700">
              현재 상황을 선택해주세요
            </Label>
            <Select
              value={profileData.situation}
              onValueChange={(value) => setProfileData({ ...profileData, situation: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="상황을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="취업준비">취업준비</SelectItem>
                <SelectItem value="창업준비">창업준비</SelectItem>
                <SelectItem value="재직중">재직중</SelectItem>
                <SelectItem value="학생">학생</SelectItem>
                <SelectItem value="구직중">구직중</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
          className="px-6"
        >
          이전
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="px-6 bg-blue-500 hover:bg-blue-600"
        >
          {step === 3 ? '완료' : '다음'}
        </Button>
      </div>
    </div>
  );
};
