import React from 'react';

const WishlistDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* HEADER SKELETON */}
      <div className="h-9 w-2/5 bg-gray-200 rounded-xl mb-3"></div>
      <div className="h-4 w-1/4 bg-gray-100 rounded-lg mb-8"></div>

      {/* ACTION BUTTONS SKELETON */}
      <div className="flex justify-between items-center mb-10">
        <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-10 bg-red-50 rounded-xl"></div>
          <div className="w-32 h-10 bg-gray-100 rounded-xl"></div>
          <div className="w-28 h-10 bg-gray-100 rounded-xl"></div>
        </div>
      </div>

      {/* METADATA GRID SKELETON */}
      <div className="flex flex-wrap gap-y-10 mb-12 w-full bg-white/50 p-6 rounded-3xl border border-gray-100">
        {/* ROW 1 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-3/12 pr-4">
            <div className="h-3 w-24 bg-gray-100 rounded mb-2.5"></div>
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
               <div className="h-5 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
        <div className="w-3/12 flex flex-col items-end pl-4">
          <div className="w-full text-right">
            <div className="h-3 w-32 bg-gray-100 rounded mb-2.5 ml-auto"></div>
            <div className="flex items-center justify-end gap-2">
               <div className="w-5 h-5 bg-gray-100 rounded-full"></div>
               <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="w-3/12 pr-4">
          <div className="h-3 w-24 bg-gray-100 rounded mb-2.5"></div>
          <div className="h-5 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="w-3/12 pr-4">
          <div className="h-3 w-32 bg-gray-100 rounded mb-2.5"></div>
          <div className="h-5 w-48 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="w-6/12 flex flex-col">
           <div className="w-full">
            <div className="h-3 w-20 bg-gray-100 rounded mb-2.5"></div>
            <div className="flex items-center gap-3 w-full">
              <div className="w-full bg-gray-100 h-3 rounded-full flex-1 overflow-hidden">
                 <div className="h-full bg-gray-200 w-1/2 rounded-full"></div>
              </div>
              <div className="w-14 h-5 bg-gray-200 rounded-lg"></div>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistDetailSkeleton;
