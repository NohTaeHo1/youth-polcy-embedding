// components/SplashScreen.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 2.5초 후에 온보딩 화면으로 이동
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500); // 2.5초로 설정[2]

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
    }, [navigate]);
    return (
        <div className="w-full max-w-sm mx-auto h-screen bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-5">
                <div className="flex gap-1">
                </div>
            </div>
            <div className="flex flex-col items-center space-y-8">
                <div className="text-xl font-bold text-blue-200 text-center mt-8">
                    서울 청년정책 네비게이터
                </div>

                <div className="mt-8">
                    <div className="w-40 h-20  rounded-lg flex items-center justify-center overflow-hidden animate-revealImage">
                        <img
                            src="/images/splash_고래.svg"
                            alt="고래 로고"
                            className="h-20 object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;
