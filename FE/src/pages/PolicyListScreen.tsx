import React, { useEffect, useState } from 'react';
import PolicyCard from '../components/PolicyCard'; // 경로 확인

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

const PolicyListScreen = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 userInfo에서 값 가져오거나, 임시 하드코딩
    fetch('http://localhost:8000/api/policy/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( userInfo )
    })
      .then(res => res.json())
      .then(data => {
        setPolicies(Array.isArray(data.results) ? data.results : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="p-4">
      <div className="bg-blue-50 rounded-xl p-6 mb-4 flex flex-col items-center">
        <span role="img" aria-label="축하">🎉</span>
        <div className="mt-2 text-lg font-semibold">
          지금 받을 수 있는 혜택 <span className="text-blue-600">{policies.length}개</span>
        </div>
        <button className="mt-3 text-blue-700 underline">
          + 맞춤형 정책 추천 받으러 가기
        </button>
      </div>
      {policies.length === 0 ? (
        <div className="text-center text-gray-400">조건에 맞는 정책이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {policies.map(policy => (
            <PolicyCard key={policy._id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyListScreen;
