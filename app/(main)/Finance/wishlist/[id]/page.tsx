'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useTransactionStore } from '@/store/transactionStore';
import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const MoneyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

const EraserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>
);

const BackIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

export default function WishlistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { currentWishlist, fetchWishlistById, addProgress, updateWishlist, deleteWishlist, isLoading: isWishlistLoading } = useWishlistStore();
  const { transactions, fetchTransactions, updateTransaction, deleteTransaction } = useTransactionStore();

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showEditProgressModal, setShowEditProgressModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [progressAmount, setProgressAmount] = useState("");
  const [selectedProgress, setSelectedProgress] = useState<{ id: string, amount: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatNumeric = (val: string) => {
    if (!val) return "";
    const cleanNumber = val.replace(/\D/g, "");
    if (!cleanNumber) return "";
    return new Intl.NumberFormat("id-ID").format(Number(cleanNumber));
  };

  const parseNumeric = (val: string) => {
    return val.replace(/\./g, "");
  };

  const [editItem, setEditItem] = useState<{
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

  useEffect(() => {
    if (id) {
      fetchWishlistById(id);
      fetchTransactions();
    }
  }, [id, fetchWishlistById, fetchTransactions]);

  useEffect(() => {
    if (currentWishlist) {
      setEditItem({
        title: currentWishlist.title,
        target_amount: formatNumeric(currentWishlist.target_amount.toString()),
        start_date: currentWishlist.start_date.split('T')[0], // Extract just YYYY-MM-DD
        end_date: currentWishlist.end_date.split('T')[0],
        urgency: currentWishlist.urgency,
      });
    }
  }, [currentWishlist]);

  if (!currentWishlist) {
    return <div className="p-8 text-center text-gray-500">Loading wishlist data...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Handle specific string format if it returns local date string
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleProgressSubmit = async () => {
    if (!progressAmount || !id) return;
    setIsSubmitting(true);
    try {
      await addProgress(id, Number(parseNumeric(progressAmount)));
      setShowProgressModal(false);
      setProgressAmount("");
      // No need to manually fetch transactions here as store action handles it
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProgressSubmit = async () => {
    if (!selectedProgress || !id) return;
    setIsSubmitting(true);
    try {
      await useWishlistStore.getState().updateProgress(selectedProgress.id, Number(parseNumeric(selectedProgress.amount)), id);
      setShowEditProgressModal(false);
      setSelectedProgress(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateWishlist(id, {
        title: editItem.title,
        target_amount: Number(parseNumeric(editItem.target_amount)),
        start_date: editItem.start_date,
        end_date: editItem.end_date,
        urgency: editItem.urgency as "LOW" | "MEDIUM" | "HIGH"
      });
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await deleteWishlist(id);
      router.push('/Finance/wishlist');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find transaction history related to this wishlist
  const progressList = transactions.filter(t => t.title === `Progress Wishlist: ${currentWishlist.title}`);

  const targetAmount = Number(currentWishlist.target_amount);
  const currentAmount = Number(currentWishlist.current_amount);
  const percentage = targetAmount > 0 ? ((currentAmount / targetAmount) * 100).toFixed(1) : '0';
  const notCollected = targetAmount - currentAmount;

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen text-gray-800 flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-1">Wishlist / {currentWishlist.title}</h1>
      <p className="text-gray-400 text-sm mb-6">
        Traces of your saving adventure today
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg text-sm font-semibold text-gray-700"
        >
          <BackIcon /> Back
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 transition-colors rounded-lg text-sm font-semibold"
          >
            Delete
          </button>
          <button 
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg text-sm font-semibold text-gray-700"
          >
            Edit Wishlist
          </button>
          <button 
            onClick={() => setShowProgressModal(true)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg text-sm font-semibold text-gray-700"
          >
            + Progress
          </button>
        </div>
      </div>

      {/* METADATA GRID */}
      <div className="flex flex-wrap gap-y-8 mb-10 w-full">
        {/* ROW 1 */}
        <div className="w-3/12 pr-4">
          <p className="text-gray-400 text-xs mb-1.5 font-medium">Date Created</p>
          <div className="flex items-center gap-2 font-semibold text-[15px] text-gray-900">
            <span className="text-gray-900"><CalendarIcon /></span>
            {formatDate(currentWishlist.createdAt || new Date().toISOString())}
          </div>
        </div>
        
        <div className="w-3/12 pr-4">
          <p className="text-gray-400 text-xs mb-1.5 font-medium">Start Date</p>
          <div className="flex items-center gap-2 font-semibold text-[15px] text-gray-900">
            <span className="text-gray-900"><CalendarIcon /></span>
            {formatDate(currentWishlist.start_date)}
          </div>
        </div>

        <div className="w-3/12 pr-4">
          <p className="text-gray-400 text-xs mb-1.5 font-medium">End Date</p>
          <div className="flex items-center gap-2 font-semibold text-[15px] text-gray-900">
            <span className="text-gray-900"><CalendarIcon /></span>
            {formatDate(currentWishlist.end_date)}
          </div>
        </div>

        <div className="w-3/12 flex flex-col items-end">
          <div className="w-full">
            <p className="text-gray-400 text-xs mb-1.5 font-medium text-right">Hasn't Been Collected</p>
            <div className="flex items-center justify-end gap-2 font-semibold text-[15px] text-gray-900">
              <span className="text-gray-900"><MoneyIcon /></span>
              {formatCurrency(notCollected > 0 ? notCollected : 0)}
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="w-3/12 pr-4">
          <p className="text-gray-400 text-xs mb-1.5 font-medium">Last Updated</p>
          <div className="font-semibold text-[15px] text-gray-900">
            {formatDate(currentWishlist.updatedAt || new Date().toISOString())}
          </div>
        </div>

        <div className="w-3/12 pr-4">
          <p className="text-gray-400 text-xs mb-1.5 font-medium">Amount Progress</p>
          <div className="font-semibold text-[15px] text-gray-900">
            {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
          </div>
        </div>

        <div className="w-6/12 flex flex-col">
          <p className="text-gray-400 text-xs mb-1.5 font-medium">Progress</p>
          <div className="flex items-center gap-3 w-full">
            <div className="w-full bg-[#eaeaec] h-2.5 rounded-full overflow-hidden flex-1">
              <div 
                className="bg-[#61b87a] h-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(Number(percentage), 100)}%` }}
              />
            </div>
            <span className="text-[13px] font-semibold text-gray-900 w-8 text-right">{Math.min(Number(percentage), 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 mb-8 mt-2"></div>

      {/* TABLE HEADER */}
      <div className="bg-[#efefef] rounded-xl px-12 py-3 mb-4 flex items-center justify-between text-sm font-semibold text-gray-800">
        <div className="w-2/5">Progress</div>
        <div className="w-1/6 text-center">Status</div>
        <div className="w-1/4 pl-6">Amount</div>
        <div className="w-1/6 text-center">Pay Date</div>
        <div className="w-24 text-center">Action</div>
      </div>

      {/* TABLE LIST */}
      <div className="space-y-3 flex-1 overflow-y-auto pb-4">
        {progressList.length === 0 ? (
          <div className="text-center text-gray-400 mt-6">No progress transactions yet. Add progress to see it here!</div>
        ) : (
          progressList.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl px-12 py-5 flex items-center justify-between transition hover:bg-gray-50"
            >
              <div className="w-2/5 font-semibold text-[14px]">
                {item.title}
              </div>

              <div className="w-1/6 flex justify-center">
                <span className={`w-24 text-center py-1.5 rounded-lg text-[10px] font-bold tracking-widest bg-[#dcfce7] text-[#16a34a]`}>
                  PAID
                </span>
              </div>

              <div className="w-1/4 font-semibold text-[14px] pl-6 text-gray-900">
                {formatCurrency(item.amount)}
              </div>

              <div className="w-1/6 text-center font-semibold text-[14px] text-gray-900">
                {formatDate(item.date)}
              </div>

              <div className="w-24 flex items-center justify-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedProgress({ id: item.id.toString(), amount: formatNumeric(item.amount.toString()) });
                    setShowEditProgressModal(true);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                >
                  <EditIcon />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this specific progress payment?")) {
                      await useWishlistStore.getState().deleteProgress(item.id.toString(), id);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <EraserIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL ADD PROGRESS */}
      {showProgressModal && (
        <Modal
          title="Add Progress"
          closeButton={() => setShowProgressModal(false)}
          submitButton={handleProgressSubmit}
        >
          <div className="pb-4">
            <Input
              label="Amount (Rp)"
              placeholder="e.g 50.000"
              autoFocus
              value={progressAmount}
              onChange={(e) => {
                let cleaned = parseNumeric(e.target.value);
                if (Number(cleaned) > notCollected) {
                  cleaned = Math.max(0, notCollected).toString();
                }
                setProgressAmount(formatNumeric(cleaned));
              }}
            />
          </div>
        </Modal>
      )}

      {/* MODAL EDIT PROGRESS */}
      {showEditProgressModal && selectedProgress && (
        <Modal
          title="Edit Progress"
          closeButton={() => {
            setShowEditProgressModal(false);
            setSelectedProgress(null);
          }}
          submitButton={handleEditProgressSubmit}
        >
          <div className="pb-4">
            <Input
              label="New Amount (Rp)"
              placeholder="e.g 50.000"
              autoFocus
              value={selectedProgress.amount}
              onChange={(e) => {
                let cleaned = parseNumeric(e.target.value);
                // Get original amount of this transaction from progressList
                const originalAmount = Number(progressList.find(t => t.id.toString() === selectedProgress.id)?.amount || 0);
                // Allow up to Target - (Total - Original)
                const maxAllowable = targetAmount - (currentAmount - originalAmount);
                if (Number(cleaned) > maxAllowable) {
                  cleaned = Math.max(0, maxAllowable).toString();
                }
                setSelectedProgress({ ...selectedProgress, amount: formatNumeric(cleaned) });
              }}
            />
          </div>
        </Modal>
      )}

      {/* MODAL EDIT WISHLIST */}
      {showEditModal && (
        <Modal
          title="Edit Wishlist"
          closeButton={() => setShowEditModal(false)}
          submitButton={handleEditSubmit}
        >
          <div className="flex flex-col gap-4 pb-4">
            <Input
              label="Title"
              placeholder="E.g. Vacations to Bali"
              value={editItem.title}
              onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
            />

            <Input
              label="Target Amount (Rp)"
              placeholder="5.000.000"
              value={editItem.target_amount}
              onChange={(e) => setEditItem({ ...editItem, target_amount: formatNumeric(e.target.value) })}
            />

            <div className="flex gap-4">
              <Input
                label="Start Date"
                type="date"
                value={editItem.start_date}
                onChange={(e) => setEditItem({ ...editItem, start_date: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={editItem.end_date}
                onChange={(e) => setEditItem({ ...editItem, end_date: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">Urgency</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm outline-none border-gray-300 focus:border-blue-500 bg-white"
                value={editItem.urgency}
                onChange={(e) => setEditItem({ ...editItem, urgency: e.target.value as any })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL DELETE */}
      {showDeleteModal && (
        <Modal
          title="Delete Wishlist"
          closeButton={() => setShowDeleteModal(false)}
        >
          <div className="flex flex-col gap-4 pb-4">
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this wishlist? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-300 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
