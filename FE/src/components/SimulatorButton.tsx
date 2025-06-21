import React from 'react';

const SimulatorButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F3F6FF] border border-[#B6C7F7] text-[#3B5BDB] font-medium text-sm shadow"
    onClick={onClick}
  >
    {/* TODO: 계산기/노트 아이콘 */}
    <span>시뮬레이터로 계산하기</span>
  </button>
);

export default SimulatorButton;