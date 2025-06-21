import React, { useState } from "react";

interface PolicyDetail {
  plcyNm: string;
  plcyExplnCn?: string;
  plcySprtCn?: string;
  aplyYmd?: (string | null)[];
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
];

const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  // 표시할 전체 정보 리스트 생성
  const allDetails = FIELD_ORDER.map(({ key, label }) => {
    const value = policy[key];
    return value ? { key, label, value: Array.isArray(value) ? value.join(', ') : value } : null;
  }).filter(Boolean);

  // 나이 필드를 별도로 맨 앞에 추가합니다.
  if (policy.sprtTrgtMinAge && policy.sprtTrgtMaxAge) {
    allDetails.unshift({
      key: "sprtTrgtMinAge",
      label: "지원 대상",
      value: `${policy.sprtTrgtMinAge}세 ~ ${policy.sprtTrgtMaxAge}세`
    });
  }

  return (
    <div
      className="rounded-xl p-4 shadow-lg max-w-xs bg-white"
      style={{
        background: "#FFF3CD",
        border: "1px solid #EAD491",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <img src="/images/policy_icon.png" alt="정책" className="w-5 h-5" />
        <span className="font-semibold text-base text-[#2D2D2D]">
          {policy.plcyNm}
        </span>
      </div>

      <ul className="text-sm space-y-2 mb-4">
        {/* ★★★ 1. 모든 정보를 표시하되, 긴 텍스트는 자릅니다 ★★★ */}
        {allDetails.map((detail) => (
          <li key={detail.key} style={{ color: "rgba(45, 45, 45, 0.8)" }}>
            <span className="font-medium">{detail.label}:</span>{' '}
            {/* 50자가 넘으면 자르고 '...'를 붙입니다. */}
            {String(detail.value).length > 50 
              ? `${String(detail.value).substring(0, 50)}...` 
              : detail.value}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-end mt-2">
        {policy.refUrlAddr1 ? (
          <a
            href={policy.refUrlAddr1}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-1 rounded-md bg-[#FFD966] text-[#6B6C74] text-xs font-medium shadow-sm hover:bg-[#ffe699] transition"
          >
            자세히 보기
          </a>
        ) : (
          <button
            disabled
            className="inline-block px-4 py-1 rounded-md bg-[#FFEFC7] text-gray-400 text-xs font-medium shadow-sm cursor-not-allowed"
            title="상세 링크가 없습니다"
          >
            자세히 보기
          </button>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;