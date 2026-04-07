import React from 'react';

const WishlistItemSkeleton = () => {
  return (
    <div className="bg-white px-12 py-5 rounded-2xl flex items-center justify-between animate-pulse border border-transparent shadow-sm">
      {/* Name Skeleton */}
      <div className="w-1/4">
        <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Priority Skeleton */}
      <div className="w-1/6">
        <div className="w-28 h-8 bg-gray-100 rounded-xl"></div>
      </div>

      {/* Status Skeleton */}
      <div className="w-1/6">
        <div className="w-28 h-8 bg-gray-50 rounded-xl"></div>
      </div>

      {/* Progress Skeleton */}
      <div className="w-1/5 flex items-center gap-3">
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div className="h-full bg-gray-200 w-1/3 rounded-full"></div>
        </div>
        <div className="w-12 h-4 bg-gray-100 rounded-md"></div>
      </div>
    </div>
  );
};

export default WishlistItemSkeleton;
