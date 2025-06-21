import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
// 카테고리별 이모지 매핑 함수
const getCategoryEmoji = (policy) => {
  // policy.clsfNm 배열이나 다른 카테고리 필드에서 분류 확인
  const categories = policy.clsfNm || [];
  const policyName = policy.plcyNm?.toLowerCase() || '';
  
  // 카테고리 배열에서 키워드 검색 또는 정책명에서 키워드 검색
  const categoryKeywords = categories.join(' ').toLowerCase() + ' ' + policyName;
  
  if (categoryKeywords.includes('주거') || categoryKeywords.includes('임대') || categoryKeywords.includes('전월세')) {
    return '🏠';
  } else if (categoryKeywords.includes('일자리') || categoryKeywords.includes('취업') || categoryKeywords.includes('창업')) {
    return '💼';
  } else if (categoryKeywords.includes('진로') || categoryKeywords.includes('상담') || categoryKeywords.includes('멘토링')) {
    return '🎯';
  } else if (categoryKeywords.includes('교육') || categoryKeywords.includes('학습') || categoryKeywords.includes('연수')) {
    return '📚';
  } else if (categoryKeywords.includes('건강') || categoryKeywords.includes('의료') || categoryKeywords.includes('치료')) {
    return '🏥';
  } else if (categoryKeywords.includes('문화') || categoryKeywords.includes('예술') || categoryKeywords.includes('체육')) {
    return '🎨';
  } else if (categoryKeywords.includes('복지') || categoryKeywords.includes('생활') || categoryKeywords.includes('지원')) {
    return '🤝';
  } else if (categoryKeywords.includes('금융') || categoryKeywords.includes('대출') || categoryKeywords.includes('보증금')) {
    return '💰';
  } else {
    return '📋'; // 기본 이모지
  }
};
const PolicyListScreen = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('주거');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleStartPolicyList = () => {
    navigate('/policy');
  };

  const handleStartSimulator = () => {
    navigate('/simulator');
  };

  const handleStartHome = () => {
    navigate('/main');
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/policy/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo)
    })
      .then(res => res.json())
      .then(data => {
        setPolicies(Array.isArray(data.results) ? data.results : []);
        setLoading(false);
      });
  }, []);

  const categories = ['주거', '일자리', '진로', '교육', '건강'];

  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 1. 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        {/* 뒤로가기 버튼 */}
        <button onClick={handleBack} className="p-2 -ml-2">
          <img src="images/arrow-circle-left.png" alt="뒤로가기" className="w-6 h-6" />
        </button>
        
        {/* 중앙 타이틀 */}
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-semibold text-gray-900">청정서울</h1>
          <div className="flex items-center mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-green-600 font-medium">온라인</span>
          </div>
        </div>
        
        {/* 더보기 버튼 */}
        <button className="p-2 -mr-2">
          <img src="images/directbox-send.png" alt="더보기" className="w-6 h-6" />
        </button>
      </div>

      {/* 2. 검색창 */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="검색할 정책 키워드를 입력해 주세요"
            className="w-full bg-gray-100 rounded-lg px-4 py-3 pr-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <img src="images/search.png" alt="검색" className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 3. 카테고리 탭 */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 정책 리스트 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {policies.length === 0 ? (
          <div className="text-center text-gray-400 py-8">조건에 맞는 정책이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy._id} className="bg-white rounded-lg p-4 border border-gray-100" 
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getCategoryEmoji(policy)}</span>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {policy.plcyNm}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      {policy.sprtTrgtMinAge && policy.sprtTrgtMaxAge && (
                        <p>• {policy.sprtTrgtMinAge}세 ~ {policy.sprtTrgtMaxAge}세</p>
                      )}
                      {policy.plcySprtCn && (
                        <p>• {policy.plcySprtCn.length > 25 
                          ? `${policy.plcySprtCn.substring(0, 25)}...` 
                          : policy.plcySprtCn}
                        </p>
                      )}
                      {policy.plcyExplnCn && (
                        <p>• {policy.plcyExplnCn.length > 25
                          ? `${policy.plcyExplnCn.substring(0, 25)}...` 
                          : policy.plcyExplnCn}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-3 flex-shrink-0">
                    {policy.refUrlAddr1 ? (
                      <a
                        href={policy.refUrlAddr1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                      >
                        신청
                      </a>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-medium">
                        마감
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. 하단 네비게이션 */}
      <div className="h-20 bg-white/70 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-gray-100">
        <div className="flex justify-around items-center pt-4">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartHome}>
            <img
              src="/images/홈.svg"
              alt="홈 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartPolicyList}>
            <img
              src="/images/청년정책.svg"
              alt="청년정책 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-600 mt-1">청년 정책</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartSimulator}>
            <img
              src="/images/시뮬레이터.svg"
              alt="시뮬레이터 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">시뮬레이터</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={handleStartChat}>
            <img
              src="/images/챗봇.svg"
              alt="챗봇 아이콘"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs text-gray-400 mt-1">AI 상담</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyListScreen;
