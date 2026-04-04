import React from 'react';

const TransactionItemSkeleton = () => {
  return (
    <div className="bg-white px-8 py-6 rounded-2xl flex items-center justify-between animate-pulse">
      {/* Title Skeleton */}
      <div className="w-1/4">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </div>

      {/* Type Badge Skeleton */}
      <div className="w-1/6 flex justify-start">
        <div className="w-28 h-8 bg-gray-100 rounded-lg"></div>
      </div>

      {/* Amount Skeleton */}
      <div className="w-1/6">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Date Skeleton */}
      <div className="w-1/6">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center gap-2 w-1/6 justify-end">
        <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
        <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
        <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
};

export default TransactionItemSkeleton;
