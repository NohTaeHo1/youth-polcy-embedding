// components/OnboardingScreen.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Home, MessageCircle, Calculator, FileText, ChevronRight } from 'lucide-react';
import { useUserInfo } from '../store/userInfoStore';


const OnboardingScreen = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        age: '',
        region: '',
        gender: '',
        householdType: ''
    });
    
    const setUserInfoGlobal = useUserInfo(state => state.setUserInfo);

    const handleSubmit = () => {
        console.log("입력 정보:", userInfo); // → 여기에 fetch나 axios 추가 예정
        setUserInfoGlobal(userInfo);
        navigate("/main");
    };

    return (
        <div className="w-full max-w-sm mx-auto h-screen bg-white relative overflow-hidden">


            <div className="flex-1 px-8 text-center">
                <img
                    src="/images/Onboarding_고래.svg"
                    alt="온보딩 고래"
                    className="w-12 h-6 mx-auto mb-4 mt-32 object-contain"
                />
                <h1 className="text-gray-800 font-bold text-sm leading-relaxed mb-8">
                    맞춤형 정책 제공을 위해<br />기본 정보를 알려주세요
                </h1>
            </div>

            <div className="mb-10  px-8 space-y-6">
                <div>
                    <label className="block text-gray-800 font-bold text-sm mb-2 mt-10">나이</label>
                    <input
                        type="text"
                        placeholder="나이를 숫자로 적어주세요"
                        value={userInfo.age}
                        onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded text-sm placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-800 font-bold text-sm mb-2 mt-10">거주지</label>
                    <div className="relative">
                        <select
                            value={userInfo.region}
                            onChange={(e) => setUserInfo({ ...userInfo, region: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded text-sm text-gray-400 appearance-none bg-white h-full"
                        >
                            <option value="">거주하고 있는 지역구를 선택해주세요</option>
                            <option value="종로구">종로구</option>
                            <option value="중구">중구</option>
                            <option value="용산구">용산구</option>
                            <option value="성동구">성동구</option>
                            <option value="광진구">광진구</option>
                            <option value="동대문구">동대문구</option>
                            <option value="중랑구">중랑구</option>
                            <option value="성북구">성북구</option>
                            <option value="강북구">강북구</option>
                            <option value="도봉구">도봉구</option>
                            <option value="노원구">노원구</option>
                            <option value="은평구">은평구</option>
                            <option value="서대문구">서대문구</option>
                            <option value="마포구">마포구</option>
                            <option value="양천구">양천구</option>
                            <option value="강서구">강서구</option>
                            <option value="구로구">구로구</option>
                            <option value="금천구">금천구</option>
                            <option value="영등포구">영등포구</option>
                            <option value="동작구">동작구</option>
                            <option value="관악구">관악구</option>
                            <option value="서초구">서초구</option>
                            <option value="강남구">강남구</option>
                            <option value="송파구">송파구</option>
                            <option value="강동구">강동구</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-800 font-bold text-sm mb-2 mt-10 ">성별</label>
                    <div className="flex gap-4">
                        {['여성', '남성'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setUserInfo({ ...userInfo, gender: g })}
                                className={`flex-1 py-3 px-4 rounded-full text-sm font-medium ${userInfo.gender === g
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-800 font-bold text-sm mb-2 mt-10">가구 유형</label>
                    <div className="relative">
                        <select
                            value={userInfo.householdType}
                            onChange={(e) => setUserInfo({ ...userInfo, householdType: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded text-sm text-gray-400 appearance-none bg-white"
                        >
                            <option value="">현재 가구 유형을 선택해주세요</option>
                            <option value="1인 가구">1인 가구</option>
                            <option value="2인 가구">2인 가구</option>
                            <option value="3인 가구">3인 가구</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="bottom-10 left-8 right-8">
                <div className="relative w-full">

                    <button
                        onClick={handleSubmit}
                        className="bottom-28 w-full py-3 bg-blue-600 text-white rounded-full font-medium"
                    >
                        맞춤형 정책 보러가기
                    </button>
                </div>
                {/* 고정된 하단 네비게이션 */}
                <div className="absolute bottom-0 bottom-0 left-0 right-0 h-24 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
                    <div className="flex justify-around items-center pt-4">
                        <div className="flex flex-col items-center">
                            <img
                                src="/images/홈.svg"
                                alt="홈 아이콘"
                                className="w-5 h-5 object-contain"
                            />
                            <span className="text-xs text-blue-600 mt-1">Home</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/images/청년정책.svg"
                                alt="청년정책 아이콘"
                                className="w-5 h-5 object-contain"
                            />
                            <span className="text-xs text-gray-400 mt-1">청년 정책</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/images/챗봇.svg"
                                alt="챗봇 아이콘"
                                className="w-5 h-5 object-contain"
                            />
                            <span className="text-xs text-gray-400 mt-1">AI 상담</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="/images/시뮬레이터.svg"
                                alt="시뮬레이터 아이콘"
                                className="w-5 h-5 object-contain"
                            />
                            <span className="text-xs text-gray-400 mt-1">시뮬레이터</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default OnboardingScreen;
