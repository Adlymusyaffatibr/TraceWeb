import { create } from 'zustand';
import axios from 'axios';
import { useTransactionStore } from './transactionStore';

export interface Wishlist {
  id: string;
  user_id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  status: 'ONGOING' | 'NOT_STARTED' | 'COMPLETED';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  start_date: string;
  end_date: string;
  percentage_completed?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistReport {
  total_wishlists: number;
  ongoing_wishlists: number;
  completed_wishlists: number;
  not_started_wishlists: number;
}

interface WishlistState {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  report: WishlistReport;
  isLoading: boolean;
  error: string | null;
  fetchWishlists: (status?: string, urgency?: string, q?: string, sort?: string) => Promise<void>;
  fetchWishlistById: (id: string) => Promise<void>;
  fetchReport: () => Promise<void>;
  createWishlist: (data: Partial<Wishlist>) => Promise<void>;
  updateWishlist: (id: string, data: Partial<Wishlist>) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;
  addProgress: (id: string, amount: number) => Promise<void>;
  updateProgress: (transactionId: string, amount: number, wishlistId: string) => Promise<void>;
  deleteProgress: (transactionId: string, wishlistId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlists: [],
  currentWishlist: null,
  report: {
    total_wishlists: 0,
    ongoing_wishlists: 0,
    completed_wishlists: 0,
    not_started_wishlists: 0,
  },
  isLoading: false,
  error: null,

  fetchWishlists: async (status, urgency, q, sort) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (urgency) params.append('urgency', urgency);
      if (q) params.append('q', q);
      if (sort) params.append('sort', sort);

      const res = await axios.get(`http://localhost:5000/wishlist?${params.toString()}`, { withCredentials: true });
      set({ wishlists: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  fetchWishlistById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`http://localhost:5000/wishlist/${id}`, { withCredentials: true });
      set({ currentWishlist: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  fetchReport: async () => {
    try {
      const res = await axios.get('http://localhost:5000/wishlist/wishlist-report', { withCredentials: true });
      set({ report: res.data });
    } catch (err: any) {
      console.error('Failed to fetch report', err);
    }
  },

  createWishlist: async (data: Partial<Wishlist>) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('http://localhost:5000/wishlist', data, { withCredentials: true });
      await get().fetchWishlists();
      await get().fetchReport();
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  updateWishlist: async (id: string, data: Partial<Wishlist>) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`http://localhost:5000/wishlist/${id}`, data, { withCredentials: true });
      if (get().currentWishlist?.id === id) {
        await get().fetchWishlistById(id);
      }
      await get().fetchWishlists();
      await get().fetchReport();
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  deleteWishlist: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`http://localhost:5000/wishlist/${id}`, { withCredentials: true });
      set({ currentWishlist: null });
      await get().fetchWishlists();
      await get().fetchReport();
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  addProgress: async (id: string, amount: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`http://localhost:5000/wishlist/${id}/progress`, { amount }, { withCredentials: true });
      // Refresh details
      await get().fetchWishlistById(id);
      await get().fetchReport();
      await useTransactionStore.getState().fetchTransactions();
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  updateProgress: async (transactionId: string, amount: number, wishlistId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`http://localhost:5000/wishlist/progress/${transactionId}`, { amount }, { withCredentials: true });
      await get().fetchWishlistById(wishlistId);
      await get().fetchReport();
      await useTransactionStore.getState().fetchTransactions();
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  deleteProgress: async (transactionId: string, wishlistId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`http://localhost:5000/wishlist/progress/${transactionId}`, { withCredentials: true });
      await get().fetchWishlistById(wishlistId);
      await get().fetchReport();
      await useTransactionStore.getState().fetchTransactions();
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  }
}));
