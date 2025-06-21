import React, { useState } from 'react';
import { policies } from "../data/policies";
import { useNavigate } from 'react-router-dom';
const categories = [
  { label: "전체", value: "all" },
  { label: "주거", value: "주거" },
  { label: "일자리", value: "일자리" },
  { label: "창업", value: "창업" },
  { label: "교육", value: "교육" },
  { label: "건강", value: "건강" },
  { label: "생활", value: "생활" },
  { label: "문화", value: "문화" },
];

const statusStyle = {
  blue: "bg-blue-100 text-blue-600 border-blue-200",
  red: "bg-red-100 text-red-600 border-red-200",
  green: "bg-green-100 text-green-600 border-green-200",
  gray: "bg-gray-200 text-gray-500 border-gray-300"
};


const PolicyList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const handleStartChat = () => {
      navigate('/chat'); // ChatScreen으로 이동
      };

  const handelStartPolicyList = () => {
      navigate('/policy'); // PolicyListScreen으로 이동
      };

  const handleStartSimulator = () => {
      navigate('/simulator'); // SimulatorScreen으로 이동
  };

  const handelStartHome = () => {
      navigate('/main'); // HomeScreen으로 이동
  }
  const filteredPolicies = policies.filter(policy => {
    const matchCategory = selectedCategory === "all" || policy.category === selectedCategory;
    const matchSearch =
      search.trim() === "" ||
      policy.title.includes(search) ||
      policy.summary.includes(search);
    return matchCategory && matchSearch;
  });

  if (!selectedPolicy) {
    return (
      <div className="bg-[#F8F8F8] min-h-screen pb-20">
        <header className="py-6 text-center font-bold text-xl tracking-tight">청정서울</header>
        <div className="px-4">
          <input
            type="text"
            placeholder="정책명, 키워드, 기관명 등으로 검색"
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* 카테고리 버튼: 가로 스크롤, 동그랗고 크기 통일 */}
          <div className="flex flex-row gap-2 mb-4 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={`
                  flex items-center justify-center
                  px-4 h-9 min-w-[64px] max-w-[120px]
                  rounded-full
                  text-sm font-semibold
                  border
                  whitespace-nowrap
                  transition
                  ${selectedCategory === cat.value
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"}
                `}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  lineHeight: "1.5",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredPolicies.map(policy => (
              <div
                key={policy.id}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer border border-gray-100 hover:shadow-md hover:border-blue-200 transition"
                onClick={() => setSelectedPolicy(policy)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-base text-gray-900">{policy.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${statusStyle[policy.statusColor]}`}>
                    {policy.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 whitespace-pre-line leading-snug">{policy.summary}</div>
              </div>
            ))}
            {filteredPolicies.length === 0 && (
              <div className="text-center text-gray-400 py-8">조건에 맞는 정책이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 상세화면은 이전과 동일하게 유지
  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      <header className="py-6 text-center font-bold text-xl tracking-tight">청정서울</header>
      <div className="px-4">
        <input
          type="text"
          placeholder="정책명, 키워드, 기관명 등으로 검색"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white mb-4"
          value={search}
          onChange={e => setSearch(e.target.value)}
          disabled
        />
        <div className="mb-4">
          <div className="bg-blue-900 text-white font-semibold px-4 py-2 rounded-t-lg">
            {selectedPolicy.title}
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">신청 자격</div>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              {selectedPolicy.details.자격.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">지원 내용</div>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              {selectedPolicy.details.내용.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">신청 일정</div>
            <ul className="text-sm text-gray-700 list-disc pl-5">
              {selectedPolicy.details.일정.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg"
          onClick={() => window.open("https://www.seoul.go.kr/", "_blank")}
        >
          지금 바로 신청하러 가기
        </button>
        <button
          className="w-full mt-2 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg"
          onClick={() => setSelectedPolicy(null)}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PolicyList;
