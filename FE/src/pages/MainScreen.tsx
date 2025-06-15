// components/MainScreen.tsx
import React from 'react';
import { Home, FileText, MessageCircle, Calculator, ChevronRight } from 'lucide-react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {
    const navigate = useNavigate();

    const handleStartChat = () => {
        navigate('/chat'); // ChatScreen으로 이동
        };

    
    return (
        <div className="w-full max-w-sm mx-auto h-screen bg-white relative flex flex-col">

            <div className="flex-1 overflow-y-auto">


                <div className="h-80 bg-gradient-to-b from-blue-600 to-blue-700 relative">
                    <div className="absolute top-20 left-8 right-8">
                        <img
                            src="/images/메인_왼쪽상단 고래.svg"
                            alt="왼쪽 상단 고래"
                            className="absolute w-42.13px h-20px top-61px left-37px"
                        />
                        <h1
                            style={{
                                position: 'absolute',
                                top: '60px',
                                left: '2px',
                                width: '129px',
                                height: '28px',
                            }}
                            className="text-white text-xl font-bold m-0"
                        >
                            안녕, 반가워!
                        </h1>
                        <p
                            className="absolute text-white/80 text-sm leading-tight m-0"
                            style={{
                                top: '95px',
                                left: '2px',
                                height: '20px', // 필요 시 줄이 많으면 제거 또는 늘리기
                            }}
                        >
                            나는 둥실고래 '둥고야'<br />어떤 정책을 알고 싶어?
                        </p>
                    </div>
                    <div className="absolute top-[128px] right-[3px] w-[168px] h-[84px] flex items-end justify-center">
                        {/* 배경 고래 (1.5배 크기) */}
                        <img
                            src="/images/메인_우측_고래배경.svg"
                            alt="배경 고래"
                            className="absolute w-[168px] h-[84px] object-contain bottom-0"
                        />

                        {/* 전면 고래 (작은 고래) */}
                        <img
                            src="/images/메인_왼쪽상단 고래.svg"
                            alt="상단 고래"
                            className="relative w-[102.13px] object-contain z-10"
                        />
                    </div>

                </div>
                <div className="px-8 -mt-16 relative z-10 pb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="bg-blue-50 rounded-t-lg p-4 -m-6 mb-4">
                            <div className="flex items-center justify-center mb-2">
                                <span className="w-10 h-10 block">
                                    <img
                                        src="/images/메인_혜택수.svg"
                                        alt="혜택 아이콘"
                                        className="w-full h-full object-contain"
                                    />
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-800 text-sm">지금 받을 수 있는혜택 </span>
                                <span className="text-blue-600 font-black text-sm">359개</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center text-blue-600 text-xs font-semibold">
                            <PlusCircle className="w-5 h-5 text-gray-400 mr-2" />
                            맞춤형 정책 추천 받으러 가기
                        </div>
                    </div>

                    {/* 시뮬레이터 섹션 */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-gray-800 font-bold">시뮬레이터</h2>
                            <div className="flex items-center text-gray-400 text-xs cursor-pointer">
                                <span className="mr-1">모두 보기</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* 주거 카드 */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-between mb-3" onClick={handleStartChat}>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        주거 {'>'}
                                    </span>
                                </div>
                                <div className="flex justify-end mb-3">
                                    <div className="w-10 h-10 rounded flex justify-center">
                                        <img
                                            src="/images/메인_주거_카드.svg"
                                            alt="주거 지원금 아이콘"
                                            className="w-10 object-contain"
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 tracking-tight leading-relaxed break-keep">
                                    주거 지원금<br />
                                    "나는 얼마 받을 수 있지?"<br />
                                    바로 확인해보세요.
                                </p>
                            </div>

                            {/* 일자리 카드 */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-between mb-3" onClick={handleStartChat}>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        일자리 {'>'}
                                    </span>
                                </div>
                                <div className="flex justify-end mb-3">
                                    <div className="w-10 h-10 rounded flex justify-center">
                                        <img
                                            src="/images/메인_일자리_카드.svg"
                                            alt="일자리 찾기 아이콘"
                                            className="w-10 object-contain"
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 tracking-tight leading-relaxed break-keep">
                                    지금 취업 준비 중이세요?<br />
                                    나에게 딱 맞는 일자리가<br />
                                    있는지 확인해 보세요.
                                </p>
                            </div>

                            {/* 창업 카드 */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-between mb-3" onClick={handleStartChat}>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        창업 {'>'}
                                    </span>
                                </div>
                                <div className="flex justify-end mb-3">
                                    <div className="w-10 h-10 rounded flex justify-center">
                                        <img
                                            src="/images/메인_창업_카드.svg"
                                            alt="청년 창업자금 아이콘"
                                            className="w-10 object-contain"
                                        />
                                    </div>
                                </div>
                                {/* 'whitespace-nowrap' 클래스 제거 */}
                                <p className="text-[9px] text-gray-600 tracking-tight leading-relaxed break-keep">
                                    세상을 바꿀 사업아이템이 있다?<br />
                                    돈은 걱정하지 마세요.<br />
                                    청년창업자금 확인해보세요.
                                </p>
                            </div>

                            {/* 교육 카드 */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-between mb-3" onClick={handleStartChat}>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                                        교육 {'>'}
                                    </span>
                                </div>
                                <div className="flex justify-end mb-3">
                                    <div className="w-10 h-10 rounded flex justify-center">
                                        <img
                                            src="/images/메인_교육_카드.svg"
                                            alt="무료 교육 및 자격증 취득 아이콘"
                                            className="w-10 object-contain"
                                        />
                                    </div>
                                </div>
                                {/* 'whitespace-nowrap' 클래스 제거 */}
                                <p className="text-[9px] text-gray-600 tracking-tight leading-relaxed break-keep">
                                    세상에 모든 교육은 다있다!<br />
                                    디자인, 코딩, 엑셀 등<br />
                                    무료로 자격증을 취득해보세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-24 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
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
                    <div className="flex flex-col items-center" onClick={handleStartChat}>
                        <img
                            src="/images/챗봇.svg"
                            alt="챗봇 아이콘"
                            className="w-5 h-5 object-contain"
                        />
                        <span className="text-xs text-gray-400 mt-1">AI 상담</span>
                    </div>
                    <div className="flex flex-col items-center" onClick={handleStartChat}>
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
    );
}

export default MainScreen;
