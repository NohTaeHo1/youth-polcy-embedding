import React, { useState } from "react";

interface PolicyDetail {
  plcyNm: string;
  plcyExplnCn?: string;
  plcySprtCn?: string;
  aplyYmd?: string[];
  plcyAplyMthdCn?: string;
  clsfNm?: string[];
  sprtTrgtMinAge?: string;
  sprtTrgtMaxAge?: string;
  rgtrInstCdNm?: string;
  etcMttrCn?: string;
  addAplyQlfcCndCn?: string;
  refUrlAddr1?: string;
}

interface PolicyCardProps {
  policy: PolicyDetail;
}

const FIELD_ORDER = [
  { key: "plcyExplnCn", label: "설명" },
  { key: "plcySprtCn", label: "지원 내용" },
  { key: "aplyYmd", label: "신청 기간" },
  { key: "plcyAplyMthdCn", label: "신청 방법" },
  { key: "clsfNm", label: "카테고리" },
  { key: "sprtTrgtMinAge", label: "지원 대상 나이" },
  { key: "rgtrInstCdNm", label: "주관기관" },
  { key: "etcMttrCn", label: "연락처" },
  { key: "addAplyQlfcCndCn", label: "추가 신청 조건" }
];

const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  const [showAll, setShowAll] = useState(false);

  // 필드별로 값이 있는 것만 추출
  const detailList = FIELD_ORDER.map(({ key, label }) => {
    let value = policy[key as keyof PolicyDetail];
    if (Array.isArray(value)) value = value.filter(Boolean).join(", ");
    if (key === "sprtTrgtMinAge" && policy.sprtTrgtMinAge && policy.sprtTrgtMaxAge) {
      value = `${policy.sprtTrgtMinAge}~${policy.sprtTrgtMaxAge}`;
    }
    return value ? `${label}: ${value}` : null;
  }).filter(Boolean) as string[];

  const displayDetails = showAll ? detailList : detailList.slice(0, 4);

  return (
    <div className="bg-[#FFF3CD] border border-[#FFE066] rounded-xl p-4 shadow max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <img
          src="/images/memo-icon.png"
          alt="정책"
          className="w-5 h-5"
        />
        <span className="font-semibold text-[#6B6C74]">{policy.plcyNm}</span>
      </div>
      <ul className="text-sm text-[#6B6C74] space-y-1 mb-3">
        {displayDetails.map((d, i) => <li key={i}>{d}</li>)}
        {detailList.length > 4 && !showAll && (
          <li>
            <button
              className="text-xs text-[#2A6FD4] underline"
              onClick={() => setShowAll(true)}
            >
              더보기
            </button>
          </li>
        )}
      </ul>
      {policy.refUrlAddr1 && (
        <a
          href={policy.refUrlAddr1}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-1 rounded bg-[#FFD966] text-[#6B6C74] text-xs font-medium shadow hover:bg-[#ffe699] transition"
        >
          자세히 보기
        </a>
      )}
    </div>
  );
};

export default PolicyCard;