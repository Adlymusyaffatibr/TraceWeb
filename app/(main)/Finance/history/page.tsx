'use client';

import React, { useState, useEffect } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import TransactionItemSkeleton from '@/components/skeletons/TransactionItemSkeleton';
import Modal from '@/components/Modal';

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

export default function HistoryPage() {
  const { historyTransactions, isLoading, error, fetchHistory } = useTransactionStore();
  
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetchHistory(startDate || undefined, endDate || undefined);
  }, [fetchHistory, startDate, endDate]);

  const filteredData = activeTab === 'ALL' 
    ? historyTransactions 
    : historyTransactions.filter(t => t.type === activeTab);

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return 'Rp 0';
    return `Rp ${Math.floor(amount).toLocaleString('id-ID')}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleOpenInfo = (trx: any) => {
    setSelectedTransaction(trx);
    setShowInfo(true);
  };

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen text-gray-800 flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      <h1 className="text-[26px] font-bold mb-1">History Transactions</h1>
      <p className="text-gray-400 text-sm mb-8">
        Traces of your saving adventure today
      </p>

      {/* FILTERS */}
      <div className="flex justify-between items-center mb-8">
        {/* TABS */}
        <div className="flex bg-white rounded-xl ">
          {['All', 'Income', 'Expense'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toUpperCase() as any)}
              className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.toUpperCase()
                  ? 'bg-gray-100 text-gray-800 '
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* DATE RANGE */}
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-gray-400 font-medium">Select Range</span>
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-transparent focus-within:border-gray-200 transition-all">
            <span className="text-gray-400"><CalendarIcon /></span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-semibold text-gray-500 bg-transparent outline-none cursor-pointer"
            />
            <span className="text-gray-300 mx-1">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-semibold text-gray-500 bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm mb-4">
             Error: {error}
          </div>
        )}

        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))
        ) : filteredData.length === 0 ? (
          <div className="bg-white py-12 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-2 border border-gray-100 shadow-sm">
            <span className="text-3xl">📅</span>
            <p className="font-medium text-sm">No transaction history found for this period.</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white px-12 py-5 rounded-2xl flex items-center justify-between transition hover:bg-gray-50 cursor-default shadow-sm border border-transparent hover:border-gray-100"
            >
              {/* Description */}
              <div className="w-1/3 font-semibold text-[13px] text-gray-800">
                {item.title}
              </div>

              {/* Type Badge */}
              <div className="w-1/6 flex justify-start">
                <span
                  className={`w-28 text-center py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase
                    ${item.type === 'INCOME'
                      ? 'bg-[#dcfce7] text-[#16a34a]'
                      : 'bg-[#ffcfd7] text-[#e11d48]'}
                  `}
                >
                  {item.type}
                </span>
              </div>

              {/* Amount */}
              <div className="w-1/5 font-bold text-[14px] text-gray-900 tracking-tight text-center">
                {formatCurrency(item.amount)}
              </div>

              {/* Date */}
              <div className="w-1/6 text-[13px] font-semibold text-gray-500 tracking-tight text-center ml-auto">
                {formatDate(item.date)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end pl-6">
                <button 
                  onClick={() => handleOpenInfo(item)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-all duration-200"
                >
                  <InfoIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INFO MODAL */}
      {showInfo && selectedTransaction && (
        <Modal 
          title="Transaction View"
          closeButton={() => setShowInfo(false)}
        >
           <div className="flex flex-col gap-6 w-full py-2 px-2 animate-in fade-in zoom-in duration-200">
              {/* Amount Display */}
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl py-8 px-4 border border-gray-100 shadow-inner">
                <span className="text-[10px] font-bold text-gray-400 mb-2 tracking-[0.2em] uppercase">Transaction Value</span>
                <span className={`text-[36px] font-bold tracking-tighter mb-4 ${selectedTransaction.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                  {selectedTransaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                </span>
                <span className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-widest ${
                  selectedTransaction.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                }`}>
                  {selectedTransaction.type}
                </span>
              </div>

              {/* Details List */}
              <div className="flex flex-col gap-1 px-1">
                {[
                  { label: 'Title', value: selectedTransaction.title },
                  { label: 'Date', value: formatDate(selectedTransaction.date) },
                  { label: 'Amount', value: formatCurrency(selectedTransaction.amount) },
                  { label: selectedTransaction.type === 'INCOME' ? 'Description' : 'Category', value: selectedTransaction.type === 'INCOME' ? (selectedTransaction.description || '-') : (selectedTransaction.category?.name || 'Uncategorized') },
                  { label: 'Type', value: selectedTransaction.type },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{row.label}</span>
                    <span className="text-sm font-bold text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
        </Modal>
      )}

    </div>
  );
}
