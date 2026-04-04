import React from 'react';

const StatsSkeleton = () => {
  return (
    <div className="flex gap-4 mb-8 h-56 animate-pulse">
      {/* Card 1: Total Balance Skeleton */}
      <div className="bg-white p-7 w-6/12 rounded-2xl flex-1 flex flex-col justify-between">
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="flex gap-3 mb-4">
            <div className="w-20 h-5 bg-gray-100 rounded-lg"></div>
            <div className="w-20 h-5 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="w-64 h-8 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Card 2: Today Income Skeleton */}
      <div className="bg-white p-6 rounded-2xl w-3/12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="w-7 h-7 bg-gray-100 rounded-lg"></div>
        </div>
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded mb-3"></div>
          <div className="w-32 h-5 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Card 3: Last Expense Skeleton */}
      <div className="bg-white p-6 rounded-2xl w-3/12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="w-7 h-7 bg-gray-100 rounded-lg"></div>
        </div>
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded mb-3"></div>
          <div className="w-32 h-5 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsSkeleton;
