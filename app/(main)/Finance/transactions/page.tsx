'use client';

import React, { useState } from 'react';

type Transaction = {
  id: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
};

const initialData: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  description: 'Blablablablabla Description',
  type: i % 2 === 0 ? 'INCOME' : 'EXPENSE',
  amount: 24850,
  date: '02 Feb 2026',
}));

// Inline SVGs for action buttons to ensure they render beautifully without new dependencies
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

const EraserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default function TransactionsPage() {
  const [list] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const filtered =
    activeTab === 'ALL'
      ? list
      : list.filter((item) => item.type === activeTab);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen text-gray-800">
      
      {/* HEADER */}
      <h1 className="text-[26px] font-bold mb-1">Transactions</h1>
      <p className="text-gray-400 text-sm mb-6">
        Traces of your saving adventure today
      </p>

      {/* STATS CARDS */}
      <div className="flex gap-4 mb-8 h-56">

        {/* Card 1: Total Balance */}
        <div className="bg-white p-7 rounded-2xl flex-1 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-[44px] font-bold tracking-tight text-gray-900">Rp 184.320,00</h2>
          </div>
          
          <div>
            <div className="flex gap-3 mb-4">
              <div className="w-20 h-5 bg-gray-100 rounded-lg"></div>
              <div className="w-20 h-5 bg-gray-100 rounded-lg"></div>
            </div>
            
            <div className="inline-block bg-[#f0f9f1] px-4 py-2 rounded-lg">
              <p className="text-[#65a36b] text-[13px] font-medium">
                Higher than last week by <span className="font-bold">Rp. 25.000,00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Today Income */}
        <div className="bg-white p-6 rounded-2xl w-72 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 text-sm font-medium">Today Income</p>
            <div className="w-7 h-7 bg-gray-100 rounded-lg"></div>
          </div>
          
          <div>
            <h2 className="text-[28px] font-semibold mb-3 text-gray-900">Rp 184.320,00</h2>
            <div className="w-40 h-5 bg-gray-100 rounded-lg"></div>
          </div>
        </div>

        {/* Card 3: Last Expense */}
        <div className="bg-white p-6 rounded-2xl w-72 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 text-sm font-medium">Last Expense</p>
            <div className="w-7 h-7 bg-gray-100 rounded-lg"></div>
          </div>
          
          <div>
            <h2 className="text-[28px] font-semibold mb-3 text-gray-900">Rp 184.320,00</h2>
            <div className="w-40 h-5 bg-gray-100 rounded-lg"></div>
          </div>
        </div>

      </div>

      {/* FILTER + SEARCH CONTROLS */}
      <div className="flex justify-between items-center mb-6 mt-4">
        
        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          {['All', 'Income', 'Expense'].map((item) => {
            const isActive = activeTab === item.toUpperCase();
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item.toUpperCase() as any);
                  setCurrentPage(1);
                }}
                className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-400 hover:text-gray-600'
                  }
                `}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400 font-medium">Select Month</span>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm cursor-pointer text-sm transition hover:bg-gray-50">
              <span className="text-gray-400"><CalendarIcon /></span>
              <span className="font-medium text-gray-500">Apr</span>
            </div>
          </div>

          <div className="flex items-center bg-white px-4 py-2.5 rounded-xl shadow-sm w-[260px]">
            <span className="text-gray-400 mr-2"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent outline-none w-full text-sm text-gray-600 placeholder-gray-300 font-medium"
            />
          </div>
        </div>

      </div>

      {/* LIST */}
      <div className="space-y-3">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="bg-white px-8 py-5 rounded-2xl flex items-center justify-between shadow-sm transition hover:shadow-md cursor-default"
          >
            {/* Description */}
            <div className="w-1/4 font-semibold text-[13px] text-black">
              {item.description}
            </div>

            {/* Type Badge */}
            <div className="w-1/6 flex justify-start">
              <span
                className={`w-28 text-center py-2 rounded-lg text-[10px] font-bold tracking-wider
                  ${item.type === 'INCOME'
                    ? 'bg-[#dcfce7] text-[#16a34a]'
                    : 'bg-[#ffcfd7] text-[#e11d48]'}
                `}
              >
                {item.type}
              </span>
            </div>

            {/* Amount - formatted like the design Rp 24.850,00 */}
            <div className="w-1/6 font-semibold text-[13px] tracking-tight text-black">
              Rp {item.amount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
            </div>

            {/* Date */}
            <div className="w-1/6 text-[13px] font-semibold text-black tracking-tight flex justify-start">
              {item.date}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-1/6 justify-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280] hover:bg-gray-200 transition">
                <InfoIcon />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#eff6ff] text-[#3b82f6] hover:bg-blue-200 transition">
                <EditIcon />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ffe4e6] text-[#f43f5e] hover:bg-red-200 transition">
                <EraserIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-6">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg bg-white shadow-sm text-sm"
            >
              {'<'}
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium shadow-sm transition
                ${p === currentPage
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'}
              `}
            >
              {p}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg bg-white shadow-sm text-sm"
            >
              {'>'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}