import React from 'react';

export default function InterestTags({ interests = [], limit = 4, className = '' }) {
  if (!interests || interests.length === 0) return null;

  const displayTags = limit ? interests.slice(0, limit) : interests;
  const remaining = limit && interests.length > limit ? interests.length - limit : 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag, idx) => (
        <span
          key={idx}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FCE7F3] text-[#DB2777] border border-[#F3DCE8] shadow-sm transition-transform hover:scale-105 select-none"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFF1F7] text-[#786B78] border border-[#F3DCE8] select-none">
          +{remaining}
        </span>
      )}
    </div>
  );
}

