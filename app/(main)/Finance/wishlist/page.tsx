'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToastStore } from '@/store/toastStore';
import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';
import WishlistItemSkeleton from '@/components/skeletons/WishlistItemSkeleton';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlists, report, fetchWishlists, fetchReport, createWishlist, isLoading } = useWishlistStore();
  const { addToast } = useToastStore();
  
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter local states
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterUrgency, setFilterUrgency] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<string[]>([]); // ['URGENCY', 'STATUS']

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );

  const [newItem, setNewItem] = useState<{
    title: string;
    target_amount: string;
    start_date: string;
    end_date: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  }>({
    title: "",
    target_amount: "",
    start_date: "",
    end_date: "",
    urgency: "MEDIUM",
  });

  const formatNumeric = (val: string | number) => {
    if (val === undefined || val === null || val === "") return "";
    if (typeof val === 'number') {
      return new Intl.NumberFormat("id-ID").format(Math.floor(val));
    }
    const numStr = String(val);
    const cleanNumber = numStr.replace(/\D/g, "");
    if (!cleanNumber) return "";
    return new Intl.NumberFormat("id-ID").format(Number(cleanNumber));
  };

  const parseNumeric = (val: string) => {
    return val.replace(/\./g, "");
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchWishlists(filterStatus || undefined, filterUrgency || undefined, searchQuery || undefined, activeSort.join(','));
      fetchReport();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchWishlists, fetchReport, filterStatus, filterUrgency, searchQuery, activeSort]);

  const handleAddSubmit = async () => {
    if (!newItem.title || !newItem.target_amount || !newItem.start_date || !newItem.end_date) {
      addToast('warning', 'Please fill in all fields before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createWishlist({
        title: newItem.title,
        target_amount: Number(parseNumeric(newItem.target_amount)),
        start_date: newItem.start_date,
        end_date: newItem.end_date,
        urgency: newItem.urgency,
      });
      setShowModal(false);
      setNewItem({ title: "", target_amount: "", start_date: "", end_date: "", urgency: "MEDIUM" });
      addToast('success', 'Wishlist item created successfully!');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to create wishlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'COMPLETED') return 'bg-blue-200 text-blue-600';
    if (status === 'ONGOING') return 'bg-green-200 text-green-600';
    return 'bg-gray-200 text-gray-600'; // NOT_STARTED
  };

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen text-gray-800 flex flex-col relative overflow-hidden">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-1">Wishlist</h1>
      <p className="text-gray-400 text-sm mb-6">
        Traces of your saving adventure today
      </p>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6 h-57">
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-gray-500 text-sm font-medium mb-1">Total</p>
          <h2 className="text-3xl font-bold text-gray-900">{report?.total_wishlists || 0}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-gray-500 text-sm font-medium mb-1">On Going</p>
          <h2 className="text-3xl font-bold text-gray-900">{report?.ongoing_wishlists || 0}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-gray-500 text-sm font-medium mb-1">Not Started</p>
          <h2 className="text-3xl font-bold text-gray-900">{report?.not_started_wishlists || 0}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
          <h2 className="text-3xl font-bold text-gray-900">{report?.completed_wishlists || 0}</h2>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex items-center justify-between  gap-3 mb-6">
        <div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-sm px-6 font-medium hover:bg-gray-200 transition duration-300 cursor-pointer py-2.5 rounded-xl text-black/70"
        >
          + Add Wishlist
        </button>
        </div>

        <div className='flex items-center gap-3'>
          <div className="relative group">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`bg-white hover:bg-gray-200 transition duration-300 cursor-pointer text-black/70 px-8 text-sm font-medium py-2.5 rounded-xl flex items-center gap-2 ${showFilter ? 'ring-2 ring-gray-200' : ''}`}
            >
              Filter By
            </button>
            
            {/* Filter Tooltip */}
            <div className={`absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-44 z-50 transition-all duration-200 ${showFilter ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              
              {/* Urgency Section */}
              <div className="px-4 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Urgency</div>
              {['HIGH', 'MEDIUM', 'LOW'].map(u => (
                <button 
                  key={u}
                  onClick={() => setFilterUrgency(filterUrgency === u ? '' : u)}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between capitalize"
                >
                  {u.toLowerCase()}
                  {filterUrgency === u && <span className="text-blue-600 scale-75"><CheckIcon /></span>}
                </button>
              ))}

              {/* Status Section */}
              <div className="px-4 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mt-1 mb-1">Status</div>
              {['COMPLETED', 'ONGOING', 'NOT_STARTED'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
                  className="w-full px-4 py-1.5 text-left text-xs hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between"
                >
                  {s.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  {filterStatus === s && <span className="text-blue-600 scale-75"><CheckIcon /></span>}
                </button>
              ))}

              <div className="border-t border-gray-50 mt-1 pt-1">
                <button 
                  onClick={() => {
                    setFilterUrgency('');
                    setFilterStatus('');
                    setShowFilter(false);
                  }}
                  className="w-full px-4 py-1.5 text-left text-[10px] text-red-500 hover:bg-red-50 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-white px-4 py-2.5 rounded-xl w-[260px]">
            <span className="text-gray-400 mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-600 placeholder-gray-300 font-medium"
            />
          </div>
        </div>
      </div>



      {/* LIST */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <WishlistItemSkeleton key={i} />
          ))
        ) : wishlists.length === 0 ? (
          <div className="text-gray-400 p-12 text-center bg-white rounded-xl">No wishlists found.</div>
        ) : (
          wishlists.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/Finance/wishlist/${item.id}`)}
              className="bg-white px-12 py-5 rounded-xl shadow flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
            >
              {/* NAME */}
              <div className="w-1/4">
                <p className="font-semibold text-gray-900 truncate pr-4">{item.title}</p>
              </div>

              {/* PRIORITY */}
              <div className="w-1/6">
                <span className={`inline-block w-28 text-center py-1.5 font-bold rounded-lg text-[10px] tracking-widest ${
                  item.urgency === 'HIGH' ? 'bg-red-100 text-red-600' : 
                  item.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-gray-100 text-gray-500'
                }`}>
                  {item.urgency}
                </span>
              </div>

              {/* STATUS */}
              <div className="w-1/6">
                <span className={`inline-block w-28 text-center py-1.5 font-bold rounded-lg text-[10px] tracking-widest ${getStatusBadgeStyle(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* PROGRESS */}
              <div className="w-1/5 flex items-center gap-3">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(item.percentage_completed || 0, 100)}%` }}
                  />
                </div>
                <span className="w-12 text-[11px] text-gray-900 font-bold text-right">
                  {Math.min(item.percentage_completed || 0, 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL ADD */}
      {showModal && (
        <Modal
          title="Add Wishlist"
          closeButton={() => setShowModal(false)}
          submitButton={handleAddSubmit}
        >
          <div className="flex flex-col gap-4 pb-4">
            <Input
              label="Title"
              placeholder="E.g. Vacations to Bali"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />

            <Input
              label="Target Amount (Rp)"
              placeholder="5.000.000"
              value={newItem.target_amount}
              onChange={(e) => setNewItem({ ...newItem, target_amount: formatNumeric(e.target.value) })}
            />

            <div className="flex gap-4">
              <Input
                label="Start Date"
                type="date"
                value={newItem.start_date}
                onChange={(e) => setNewItem({ ...newItem, start_date: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={newItem.end_date}
                onChange={(e) => setNewItem({ ...newItem, end_date: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">Urgency</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm outline-none border-gray-300 focus:border-blue-500 bg-white"
                value={newItem.urgency}
                onChange={(e) => setNewItem({ ...newItem, urgency: e.target.value as any })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}