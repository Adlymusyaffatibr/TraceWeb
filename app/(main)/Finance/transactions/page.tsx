'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';
import { useTransactionStore, Category } from '@/store/transactionStore';
import StatsSkeleton from '@/components/skeletons/StatsSkeleton';
import TransactionItemSkeleton from '@/components/skeletons/TransactionItemSkeleton';
import axios from 'axios';

// Inline SVGs for action buttons
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

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12c0 0 3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
);

export default function TransactionsPage() {
  const { transactions, summary, isLoading, error, fetchTransactions, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isIncomeVisible, setIsIncomeVisible] = useState(true);
  const [isExpenseVisible, setIsExpenseVisible] = useState(true);
  const ITEMS_PER_PAGE = 7;

  // Form State
  const [modalAction, setModalAction] = useState<'CREATE' | 'EDIT' | 'INFO' | 'DELETE' | null>(null);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('INCOME'); // only for CREATE fallback
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category_id: ''
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/category', { withCredentials: true });
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Derived state for filtering and pagination
  const filteredData = activeTab === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === activeTab);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // Handle cases where the date might already be formatted or invalid
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return 'Rp 0';
    const formatted = Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formatted}`;
  };

  const getMaskedAmount = (amount: number) => {
    if (amount === undefined || amount === null) return 'Rp *';
    const digitsCount = Math.floor(amount).toString().length;
    return `Rp ${'*'.repeat(digitsCount)}`;
  };

  const closeModal = () => {
    setModalAction(null);
    setSelectedTransaction(null);
  };

  const handleOpenAdd = (type: 'INCOME' | 'EXPENSE') => {
    setModalAction('CREATE');
    setModalType(type);
    setFormData({ title: '', amount: '', date: '', category_id: '' });
    setFormError('');
  };

  const handleOpenEdit = (trx: any) => {
    setModalAction('EDIT');
    setSelectedTransaction(trx);
    setFormData({ 
      title: trx.title || '', 
      amount: trx.amount ? String(trx.amount) : '', 
      date: trx.date || '', 
      category_id: trx.category_id ? String(trx.category_id) : '' 
    });
    setFormError('');
  };

  const handleOpenInfo = (trx: any) => {
    setModalAction('INFO');
    setSelectedTransaction(trx);
    setFormError('');
  };

  const handleOpenDelete = (trx: any) => {
    setModalAction('DELETE');
    setSelectedTransaction(trx);
    setFormError('');
  };

  const handleSubmit = async () => {
    setFormError('');
    setIsSubmitting(true);
    
    try {
      if (modalAction === 'CREATE') {
        if (!formData.title || !formData.amount || !formData.date) {
            setFormError('Please fill in title, amount, and date.');
            setIsSubmitting(false);
            return;
        }
        await addTransaction({
          title: formData.title,
          amount: Number(formData.amount),
          type: modalType,
          date: formData.date,
          category_id: formData.category_id ? Number(formData.category_id) : undefined
        });
      } else if (modalAction === 'EDIT' && selectedTransaction) {
        if (!formData.title || !formData.amount || !formData.date) {
            setFormError('Please fill in title, amount, and date.');
            setIsSubmitting(false);
            return;
        }
        await updateTransaction(selectedTransaction.id, {
          title: formData.title,
          amount: Number(formData.amount),
          date: formData.date,
          category_id: formData.category_id ? Number(formData.category_id) : undefined
        });
      } else if (modalAction === 'DELETE' && selectedTransaction) {
        await deleteTransaction(selectedTransaction.id);
      }
      
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen text-gray-800 flex flex-col relative overflow-hidden">
      
      {/* Modal */}
      {modalAction && (
        <Modal 
          title={
            modalAction === 'CREATE' ? `Add ${modalType === 'INCOME' ? 'Income' : 'Expense'}` :
            modalAction === 'EDIT' ? 'Edit Transaction' :
            modalAction === 'DELETE' ? 'Delete Transaction' :
            'Transaction Details'
          }
          closeButton={closeModal}
          submitButton={modalAction === 'INFO' ? undefined : handleSubmit}
          resetButton={modalAction === 'CREATE' || modalAction === 'EDIT' ? () => {
            setFormData({ title: '', amount: '', date: '', category_id: '' });
            setFormError('');
          } : undefined}
        >
          {modalAction === 'DELETE' ? (
            <div className="flex flex-col gap-4 pb-4 px-2">
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm relative">
                  {formError}
                </div>
              )}
              <p className="text-gray-700">
                Are you sure you want to delete the transaction <span className="font-semibold text-black">"{selectedTransaction?.title}"</span>? This action cannot be undone.
              </p>
            </div>
          ) : modalAction === 'INFO' ? (
            <div className="flex flex-col gap-6 w-full py-2 px-2">
              {/* Amount Display */}
              <div className="flex flex-col items-center justify-center bg-[#F9FAFB] rounded-2xl py-6 px-4 border border-[#F3F4F6]">
                <span className="text-xs font-medium text-gray-400 mb-1 tracking-wide uppercase">Transaction Amount</span>
                <span className={`text-[32px] font-bold tracking-tight mb-3 ${selectedTransaction?.type === 'INCOME' ? 'text-[#16a34a]' : 'text-[#e11d48]'}`}>
                  {selectedTransaction?.type === 'INCOME' ? '+' : '-'}{formatCurrency(selectedTransaction?.amount || 0)}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest ${
                  selectedTransaction?.type === 'INCOME' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#ffcfd7] text-[#e11d48]'
                }`}>
                  {selectedTransaction?.type}
                </span>
              </div>

              {/* Details List */}
              <div className="flex flex-col gap-3 px-1">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-500">Title</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedTransaction?.title}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-500">Date</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(selectedTransaction?.date)}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-500">Amount</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(selectedTransaction?.amount || 0)}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedTransaction?.category?.name || '-'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm relative">
                  {formError}
                </div>
              )}
              
              <Input 
                label="Title" 
                placeholder="e.g. Salary, Groceries..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              
              <Input 
                label="Amount (Rp)" 
                type="number"
                placeholder="e.g. 50000"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
              
              <Input 
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none border-gray-300 focus:border-blue-500 bg-white"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="">Select Category (Optional)</option>
                  {categories.filter(c => c.type === (modalAction === 'EDIT' && selectedTransaction ? selectedTransaction.type : modalType)).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* HEADER */}
      <h1 className="text-[26px] font-bold mb-1">Transactions</h1>
      <p className="text-gray-400 text-sm mb-6">
        Traces of your saving adventure today
      </p>

      {/* STATS CARDS */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="flex gap-4 mb-8 h-56">

          {/* Card 1: Total Balance */}
          <div className="bg-white p-7 w-6/12 rounded-2xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <p className="text-gray-500 text-sm font-medium">Total Balance</p>
                <button 
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="w-7 h-7 bg-[#f3f3f3] hover:bg-[#e2e2e2] transition-colors rounded-lg flex items-center justify-center text-gray-500"
                >
                  {isBalanceVisible ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              <h2 className="text-[44px] font-bold tracking-tight text-gray-900">
                {isBalanceVisible ? formatCurrency(summary.total_balance || 0) : getMaskedAmount(summary.total_balance || 0)}
              </h2>
            </div>
            
            <div>
            
          
              <div className="inline-block bg-[#f0f9f1] px-4 py-2 rounded-lg">
                <p className="text-[#65a36b] text-[13px] font-medium">
                  Higher than last week by <span className="font-bold">Rp. 25.000,00</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Today Income */}
          <div className="bg-white p-6 rounded-2xl w-3/12 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-gray-500 text-sm font-medium">Total Income</p>
              <div className="flex gap-2">
                <button 
                   onClick={() => setIsIncomeVisible(!isIncomeVisible)}
                   className="w-7 h-7 bg-[#f3f3f3] hover:bg-[#e2e2e2] transition-colors rounded-lg flex items-center justify-center text-gray-500"
                >
                   {isIncomeVisible ? <EyeIcon /> : <EyeOffIcon />}
                </button>
                <button 
                  onClick={() => handleOpenAdd('INCOME')}
                  className="w-7 h-7 bg-[#f3f3f3] hover:bg-[#e2e2e2] transition-colors rounded-lg flex items-center justify-center text-gray-600 text-lg font-light leading-none"
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-[28px] font-semibold mb-3 text-gray-900">
                {isIncomeVisible ? formatCurrency(summary.total_income || 0) : getMaskedAmount(summary.total_income || 0)}
              </h2>
              <div className="w-fit px-3 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-xs font-medium">Last Added : Rp.20.000</p>
              </div>
            </div>
          </div>

          {/* Card 3: Last Expense */}
          <div className="bg-white p-6 rounded-2xl w-3/12 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-gray-500 text-sm font-medium">Total Expense</p>
              <div className="flex gap-2">
                <button 
                   onClick={() => setIsExpenseVisible(!isExpenseVisible)}
                   className="w-7 h-7 bg-[#f3f3f3] hover:bg-[#e2e2e2] transition-colors rounded-lg flex items-center justify-center text-gray-500"
                >
                   {isExpenseVisible ? <EyeIcon /> : <EyeOffIcon />}
                </button>
                <button 
                  onClick={() => handleOpenAdd('EXPENSE')}
                  className="w-7 h-7 bg-[#f3f3f3] hover:bg-[#e2e2e2] transition-colors rounded-lg flex items-center justify-center text-gray-600 text-lg font-light leading-none"
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-[28px] font-semibold mb-3 text-gray-900">
                {isExpenseVisible ? formatCurrency(summary.total_expense || 0) : getMaskedAmount(summary.total_expense || 0)}
              </h2>
              <div className="w-fit px-3 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-xs font-medium">Last Added : Rp.20.000</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* FILTER + SEARCH CONTROLS */}
      <div className="flex justify-between items-center mb-6 ">
        
        {/* Tabs */}
        <div className="flex bg-white rounded-xl ">
          {['All', 'Income', 'Expense'].map((item) => {
            const isActive = activeTab === item.toUpperCase();
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item.toUpperCase() as any);
                }}
                className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-gray-200 text-gray-800'
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
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl cursor-pointer text-sm transition hover:bg-gray-50">
              <span className="text-gray-400"><CalendarIcon /></span>
              <span className="font-medium text-gray-500">Apr</span>
            </div>
          </div>

          <div className="flex items-center bg-white px-4 py-2.5 rounded-xl w-[260px]">
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
      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))
        ) : paginatedData.length === 0 ? (
            <div className="bg-white px-8 py-5 rounded-2xl flex justify-center text-gray-400">No transactions found.</div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white px-8 py-5 rounded-2xl flex items-center justify-between transition hover:bg-gray-50 cursor-default"
            >
              {/* Description */}
              <div className="w-1/4 font-semibold text-[13px] text-black">
                {item.title}
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

              {/* Amount */}
              <div className="w-1/6 font-semibold text-[13px] tracking-tight text-black">
                {formatCurrency(item.amount)}
              </div>

              {/* Date */}
              <div className="w-1/6 text-[13px] font-semibold text-black tracking-tight flex justify-start">
                {formatDate(item.date)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-1/6 justify-end">
                <button 
                  onClick={() => handleOpenInfo(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                >
                  <InfoIcon />
                </button>
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition"
                >
                  <EditIcon />
                </button>
                <button 
                  onClick={() => handleOpenDelete(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition"
                >
                  <EraserIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-6">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg bg-white text-sm"
            >
              {'<'}
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition
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
              className="px-3 py-1 rounded-lg bg-white text-sm"
            >
              {'>'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}