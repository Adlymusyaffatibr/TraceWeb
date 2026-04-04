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
  description: 'Blablablabla Description',
  type: i % 2 === 0 ? 'INCOME' : 'EXPENSE',
  amount: 24850,
  date: '02 Feb 2026',
}));

export default function TransactionsPage() {
  const [list] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedRow, setSelectedRow] = useState<number | null>(1);

  // 🔥 PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-1">Transactions</h1>
      <p className="text-gray-500 mb-6">
        Traces of your saving adventure today
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl">
          <p className="text-gray-400 text-sm mb-2">Total Balance</p>
          <h2 className="text-2xl font-semibold">Rp 184.320,00</h2>

          <div className="mt-3 h-2 bg-gray-200 rounded-full w-1/2" />
          <p className="text-xs text-green-500 mt-2">
            Higher than last week by Rp. 25.000,00
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl flex flex-col justify-between">
          <p className="text-gray-400 text-sm">Today Income</p>
          <h2 className="text-xl font-semibold">Rp 184.320,00</h2>
          <div className="mt-2 h-2 bg-gray-200 rounded-full w-2/3" />
        </div>

        <div className="bg-white p-5 rounded-xl flex flex-col justify-between">
          <p className="text-gray-400 text-sm">Last Expense</p>
          <h2 className="text-xl font-semibold">Rp 184.320,00</h2>
          <div className="mt-2 h-2 bg-gray-200 rounded-full w-2/3" />
        </div>

      </div>

      {/* FILTER + SEARCH */}
      <div className="flex justify-between items-center mb-4">

        <div className="flex gap-2">
          {['ALL', 'INCOME', 'EXPENSE'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveTab(item as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium
                ${activeTab === item
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-600'}
              `}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <select className="bg-gray-200 px-3 py-1.5 rounded-lg text-sm">
            <option>Apr</option>
            <option>May</option>
            <option>Jun</option>
          </select>

          <input
            type="text"
            placeholder="Search anything..."
            className="bg-gray-200 px-3 py-1.5 rounded-lg text-sm outline-none"
          />
        </div>

      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 px-6 py-2 text-xs text-gray-400">
        <p className="col-span-2">Description</p>
        <p>Type</p>
        <p>Amount</p>
        <p>Date</p>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedRow(item.id)}
            className={`grid grid-cols-5 items-center px-6 py-4 rounded-xl bg-white cursor-pointer transition
              ${selectedRow === item.id
                ? 'border-2 border-blue-400'
                : 'hover:bg-gray-50'}
            `}
          >

            <p className="col-span-2 text-sm">
              {item.description}
            </p>

            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold w-fit
                ${item.type === 'INCOME'
                  ? 'bg-green-200 text-green-600'
                  : 'bg-red-200 text-red-600'}
              `}
            >
              {item.type}
            </span>

            <p className="text-sm">
              Rp {item.amount.toLocaleString()}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {item.date}
              </p>

              <div className="flex gap-2 ml-2">
                <button className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-xs">
                  👁
                </button>
                <button className="w-6 h-6 flex items-center justify-center rounded bg-blue-200 text-xs">
                  ✏
                </button>
                <button className="w-6 h-6 flex items-center justify-center rounded bg-red-200 text-xs">
                  🗑
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 mt-6">

        {/* PREV */}
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 text-sm"
          >
            {'<'}
          </button>
        )}

        {/* NUMBER */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`px-3 py-1 rounded text-sm
              ${p === currentPage
                ? 'bg-black text-white'
                : 'bg-gray-200'}
            `}
          >
            {p}
          </button>
        ))}

        {/* NEXT */}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 text-sm"
          >
            {'>'}
          </button>
        )}

      </div>

    </div>
  );
}