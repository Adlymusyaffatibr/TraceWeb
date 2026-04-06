'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlists, report, fetchWishlists, fetchReport, createWishlist, isLoading } = useWishlistStore();
  
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter local states (we can also do this server side, but let's just trigger a re-fetch)
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterUrgency, setFilterUrgency] = useState<string>('');

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

  const formatNumeric = (val: string) => {
    if (!val) return "";
    const cleanNumber = val.replace(/\D/g, "");
    if (!cleanNumber) return "";
    return new Intl.NumberFormat("id-ID").format(Number(cleanNumber));
  };

  const parseNumeric = (val: string) => {
    return val.replace(/\./g, "");
  };

  useEffect(() => {
    fetchWishlists(filterStatus, filterUrgency);
    fetchReport();
  }, [fetchWishlists, fetchReport, filterStatus, filterUrgency]);

  const handleAddSubmit = async () => {
    if (!newItem.title || !newItem.target_amount || !newItem.start_date || !newItem.end_date) return;
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
    } catch (err) {
      console.error(err);
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
      <div className="grid grid-cols-4 gap-4 mb-8 h-56">
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
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          + Add Wishlist
        </button>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          + Filter
        </button>
      </div>

      {/* FILTER */}
      {showFilter && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilterStatus('ONGOING')}
            className={`px-3 py-1 rounded transition-colors ${filterStatus === 'ONGOING' ? 'bg-green-300' : 'bg-green-200'}`}
          >
            On Going
          </button>

          <button
            onClick={() => setFilterUrgency('HIGH')}
            className={`px-3 py-1 rounded transition-colors ${filterUrgency === 'HIGH' ? 'bg-red-300' : 'bg-red-200'}`}
          >
            Urgent
          </button>

          <button
            onClick={() => {
              setFilterStatus('');
              setFilterUrgency('');
            }}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Reset
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-1.5 flex-1 overflow-y-auto pr-2">
        {isLoading && wishlists.length === 0 ? (
          <div className="text-gray-400 p-4">Loading wishlists...</div>
        ) : (
          wishlists.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/Finance/wishlist/${item.id}`)}
              className="bg-white px-12 py-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
            >
              {/* NAME */}
              <div className="w-1/4">
                <p className="font-medium truncate pr-4">{item.title}</p>
              </div>

              {/* PRIORITY */}
              <div className="w-1/6">
                <span className={`inline-block w-28 text-center py-1.5 font-semibold rounded-lg text-[0.65rem] ${
                  item.urgency === 'HIGH' ? 'bg-red-200 text-red-600' : 
                  item.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-gray-200 text-gray-500'
                }`}>
                  {item.urgency}
                </span>
              </div>

              {/* STATUS */}
              <div className="w-1/6">
                <span className={`inline-block w-28 text-center py-1.5 font-semibold rounded-lg text-[0.65rem] ${getStatusBadgeStyle(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* PROGRESS */}
              <div className="w-1/5 flex items-center gap-3">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(item.percentage_completed || 0, 100)}%` }}
                  />
                </div>
                <span className="w-12 text-xs text-black font-semibold text-right">
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