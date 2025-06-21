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

    const handelStartPolicyList = () => {
        navigate('/policy'); // PolicyListScreen으로 이동
        };

    const handleStartSimulator = () => {
        navigate('/simulator'); // SimulatorScreen으로 이동
    };

    return (
        <div className="w-full max-w-sm mx-auto h-screen bg-white relative flex flex-col font-sans overflow-hidden">

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="h-80 relative" style={{ backgroundColor: '#2A6FD4' }}>
                    <div className="absolute top-4 left-8 right-8">
                    <img
                        src="/images/메인_왼쪽상단 고래.svg"
                        alt="왼쪽 상단 고래"
                        className="absolute w-[42px] h-[20px] top-[12px] left-[2px]"
                    />
                    <h1
                        style={{
                        position: 'absolute',
                        top: '100px',
                        left: '2px',
                        width: '129px',
                        height: '28px',
                        fontSize: '22px',
                        }}
                        className="text-white font-bold m-0"
                    >
                        안녕, 반가워!
                    </h1>
                    <p
                        className="absolute text-white/80 leading-tight m-0"
                        style={{
                        top: '135px',
                        left: '2px',
                        height: '40px',
                        fontSize: '15px',
                        lineHeight: '20px',
                        }}
                    >
                        나는 둥실고래 '둥고야'<br />어떤 정책을 알고 싶어?
                    </p>
                    </div>
                
                    {/* 우측 구름+Seoul+고래 조합 (원래 구조 유지) */}
                    <div className="absolute top-[90px] right-[0px] w-[190px] h-[100px] flex items-end justify-center">
                        {/* 배경 고래 더 크게 */}
                        <img
                            src="/images/메인_우측_고래배경.svg"
                            alt="배경 고래"
                            className="absolute w-[190px] h-[100px] object-contain bottom-0"
                        />
                        {/* 작은 고래 크기 조정 */}
                        <img
                            src="/images/메인_왼쪽상단 고래.svg"
                            alt="상단 고래"
                            className="relative w-[120px] object-contain z-10"
                        />
                    </div>
                    
                    {/* 알림/설정 아이콘 */}
                    <div className="absolute top-[18px] right-[18px] flex items-center gap-4 z-20">
                    <img src="/images/메인설정.png" alt="설정" className="w-[20px] h-[20px]" />
                    <img src="/images/메인알람.png" alt="알림" className="w-[20px] h-[20px]" />
                    </div>
                </div>

                {/* 카드 - 헤더와 적절한 간격으로 배치 */}
                <div className="absolute top-[225px] left-1/2 -translate-x-1/2 w-full max-w-[340px] z-10 px-4">
                <div className="bg-white rounded-2xl shadow-[0_6px_16px_0_rgba(0,0,0,0.15)] overflow-hidden">

                    {/* 상단: 혜택 정보 영역 */}
                    <div className="px-6 py-3 text-center">
                        <div className="flex flex-col items-center">
                        <img 
                            src="/images/메인혜택알림.png" 
                            alt="혜택 아이콘" 
                            className="w-10 h-10 mb-1" 
                        />
                        <div className="flex items-baseline">
                            <span className="text-[16px] text-gray-800 font-bold mr-1">
                            지금 받을 수 있는 혜택&nbsp;
                            </span>
                            <span className="text-[#2A6FD4] font-black text-[17px]">359개</span>
                        </div>
                        </div>
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    
                    {/* 하단: 버튼 영역 */}
                    <div className="px-6 py-2.5 bg-[#ECF1FE]">
                        <button className="w-full flex items-center justify-center gap-2 text-[#2A6FD4] text-[14px] font-semibold hover:text-[#1e5ba8] transition-colors duration-200" onClick={handleStartChat}>
                        <svg width="16" height="16" fill="none" className="text-current">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        맞춤형 정책 추천 받으러 가기
                        </button>
                    </div>
                </div>



                    {/* 시뮬레이터 섹션 */}
                    <div className="px-0 pt-8 pb-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[17px] text-gray-800 font-bold">시뮬레이터</h2>
                            <div className="flex items-center text-gray-400 text-[12px] cursor-pointer">
                            <span className="mr-1">모두 보기</span>
                            <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* 주거 카드 */}
                            <div className="bg-white rounded-xl shadow-[0_8px_25px_0_rgba(0,0,0,0.15),0_3px_10px_0_rgba(0,0,0,0.1)] border border-gray-50 p-4 hover:shadow-[0_12px_35px_0_rgba(0,0,0,0.2),0_5px_15px_0_rgba(0,0,0,0.15)] transition-shadow duration-300" onClick={handleStartSimulator}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-blue-50 text-[#2A6FD4] px-3 py-1 rounded-full text-[11px] font-semibold">
                                주거 &gt;
                                </span>
                            </div>
                            <div className="flex justify-end mb-3">
                                <div className="w-8 h-8 flex justify-center items-center">
                                <img
                                    src="/images/메인_주거_카드.svg"
                                    alt="주거 지원금 아이콘"
                                    className="w-8 h-8 object-contain"
                                />
                                </div>
                            </div>
                            <p className="text-[9.5px] text-gray-600 leading-[14px] break-keep">
                                주거 지원금<br />
                                "나는 얼마나 받을 수 있지?"<br />
                                바로 확인해보세요.
                            </p>
                            </div>

                            {/* 일자리 카드 */}
                            <div className="bg-white rounded-xl shadow-[0_8px_25px_0_rgba(0,0,0,0.15),0_3px_10px_0_rgba(0,0,0,0.1)] border border-gray-50 p-4 hover:shadow-[0_12px_35px_0_rgba(0,0,0,0.2),0_5px_15px_0_rgba(0,0,0,0.15)] transition-shadow duration-300" onClick={handleStartSimulator}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-blue-50 text-[#2A6FD4] px-3 py-1 rounded-full text-[11px] font-semibold">
                                일자리 &gt;
                                </span>
                            </div>
                            <div className="flex justify-end mb-3">
                                <div className="w-8 h-8 flex justify-center items-center">
                                <img
                                    src="/images/메인_일자리_카드.svg"
                                    alt="일자리 찾기 아이콘"
                                    className="w-8 h-8 object-contain"
                                />
                                </div>
                            </div>
                            <p className="text-[9.5px] text-gray-600 leading-[14px] break-keep">
                                지금 취업 준비 중이세요?<br />
                                나에게 딱 맞는 일자리가<br />
                                있는지 확인해보세요.
                            </p>
                            </div>

                            {/* 창업 카드 */}
                            <div className="bg-white rounded-xl shadow-[0_8px_25px_0_rgba(0,0,0,0.15),0_3px_10px_0_rgba(0,0,0,0.1)] border border-gray-50 p-4 hover:shadow-[0_12px_35px_0_rgba(0,0,0,0.2),0_5px_15px_0_rgba(0,0,0,0.15)] transition-shadow duration-300" onClick={handleStartSimulator}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-blue-50 text-[#2A6FD4] px-3 py-1 rounded-full text-[11px] font-semibold">
                                창업 &gt;
                                </span>
                            </div>
                            <div className="flex justify-end mb-3">
                                <div className="w-8 h-8 flex justify-center items-center">
                                <img
                                    src="/images/메인_창업_카드.svg"
                                    alt="청년 창업자금 아이콘"
                                    className="w-8 h-8 object-contain"
                                />
                                </div>
                            </div>
                            <p className="text-[8.5px] text-gray-600 leading-[14px] break-keep">
                                세상을 바꿀 사업아이템이 있다?<br />
                                돈은 걱정하지 마세요.<br />
                                청년창업자금 확인해보세요.
                            </p>
                            </div>

                            {/* 교육 카드 */}
                            <div className="bg-white rounded-xl shadow-[0_8px_25px_0_rgba(0,0,0,0.15),0_3px_10px_0_rgba(0,0,0,0.1)] border border-gray-50 p-4 hover:shadow-[0_12px_35px_0_rgba(0,0,0,0.2),0_5px_15px_0_rgba(0,0,0,0.15)] transition-shadow duration-300" onClick={handleStartSimulator}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="bg-blue-50 text-[#2A6FD4] px-3 py-1 rounded-full text-[11px] font-semibold">
                                교육 &gt;
                                </span>
                            </div>
                            <div className="flex justify-end mb-3">
                                <div className="w-8 h-8 flex justify-center items-center">
                                <img
                                    src="/images/메인_교육_카드.svg"
                                    alt="무료 교육 및 자격증 취득 아이콘"
                                    className="w-8 h-8 object-contain"
                                />
                                </div>
                            </div>
                            <p className="text-[8.5px] text-gray-600 leading-[14px] break-keep">
                                세상에 모든 교육은 다 있다!<br />
                                디자인, 코딩, 엑셀 등<br />
                                무료로 자격증을 취득해보세요.
                            </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-20 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
                <div className="flex justify-around items-center pt-4">
                    <div className="flex flex-col items-center">
                        <img
                            src="/images/홈.svg"
                            alt="홈 아이콘"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-s text-blue-600 mt-1">Home</span>
                    </div>
                    <div className="flex flex-col items-center" onClick={handelStartPolicyList}>
                        <img
                            src="/images/청년정책.svg"
                            alt="청년정책 아이콘"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-s text-gray-400 mt-1">청년 정책</span>
                    </div>
                    <div className="flex flex-col items-center" onClick={handleStartSimulator}>
                        <img
                            src="/images/시뮬레이터.svg"
                            alt="시뮬레이터 아이콘"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-s text-gray-400 mt-1">시뮬레이터</span>
                    </div>
                    <div className="flex flex-col items-center" onClick={handleStartChat}>
                        <img
                            src="/images/챗봇.svg"
                            alt="챗봇 아이콘"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-s text-gray-400 mt-1">AI 상담</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainScreen;
