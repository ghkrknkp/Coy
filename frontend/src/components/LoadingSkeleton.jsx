import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-sm sm:max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-7 border border-[#F3DCE8] shadow-card-soft animate-pulse">
      {/* Desktop Horizontal Skeleton / Mobile Stacked Skeleton */}
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* Photo Skeleton */}
        <div className="w-full sm:w-1/2 aspect-[4/5] sm:aspect-square bg-gradient-to-tr from-[#FFF1F7] to-[#FCE7F3] rounded-2xl" />

        {/* Content Skeleton */}
        <div className="w-full sm:w-1/2 flex flex-col justify-between py-2 space-y-4">
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-[#FCE7F3] rounded-lg" />
            <div className="h-4 w-1/3 bg-[#FFF1F7] rounded-md" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-[#FFF1F7] rounded" />
            <div className="h-4 w-5/6 bg-[#FFF1F7] rounded" />
          </div>

          <div className="flex gap-2">
            <div className="h-7 w-16 bg-[#FCE7F3] rounded-full" />
            <div className="h-7 w-16 bg-[#FCE7F3] rounded-full" />
            <div className="h-7 w-16 bg-[#FCE7F3] rounded-full" />
          </div>

          <div className="flex justify-center sm:justify-start gap-4 pt-4">
            <div className="w-14 h-14 rounded-full bg-[#FFF1F7]" />
            <div className="w-16 h-16 rounded-full bg-[#FCE7F3]" />
          </div>
        </div>
      </div>
    </div>
  );
}

