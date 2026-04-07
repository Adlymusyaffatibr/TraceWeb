import React from 'react';

const ProgressItemSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl px-12 py-5 flex items-center justify-between animate-pulse shadow-sm border border-gray-50">
      {/* Title Skeleton */}
      <div className="w-2/5">
        <div className="h-4 w-56 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Status Skeleton */}
      <div className="w-1/6 flex justify-center">
        <div className="w-24 h-8 bg-gray-100 rounded-xl"></div>
      </div>

      {/* Amount Skeleton */}
      <div className="w-1/4 pl-6">
        <div className="h-4 w-36 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Date Skeleton */}
      <div className="w-1/6 text-center">
        <div className="h-4 w-28 bg-gray-200 rounded-lg mx-auto"></div>
      </div>

      {/* Actions Skeleton */}
      <div className="w-24 flex items-center justify-center gap-2">
        <div className="w-9 h-9 bg-gray-50 rounded-xl"></div>
        <div className="w-9 h-9 bg-gray-50 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProgressItemSkeleton;
