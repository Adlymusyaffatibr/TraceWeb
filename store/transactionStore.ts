import { create } from 'zustand';
import axios from 'axios';

export interface Category {
  id: string;
  name: string;
  type: string;
}

export interface Transaction {
  id: number;
  title: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
  description?: string;
  category_id?: string | null;
  category?: Category;
}

export interface Summary {
  total_income: number;
  total_expense: number;
  total_balance: number;
  global_balance: number;
  last_income_amount: number;
  last_expense_amount: number;
  balance_diff_last_week: number;
}

export interface DashboardData {
  summary: {
    total_balance: number;
    total_income: number;
    total_expense: number;
  };
  chartData: {
    income: number[];
    expense: number[];
  };
  outgoingHistory: Transaction[];
}

interface TransactionState {
  transactions: Transaction[];
  summary: Summary;
  historyTransactions: Transaction[];
  historySummary: Partial<Summary>;
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (month?: number, q?: string) => Promise<void>;
  fetchHistory: (startDate?: string, endDate?: string) => Promise<void>;
  fetchDashboard: () => Promise<void>;
  addTransaction: (data: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: number, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  summary: {
    total_income: 0,
    total_expense: 0,
    total_balance: 0,
    global_balance: 0,
    last_income_amount: 0,
    last_expense_amount: 0,
    balance_diff_last_week: 0
  },
  historyTransactions: [],
  historySummary: {
    total_income: 0,
    total_expense: 0,
    total_balance: 0,
  },
  dashboardData: null,
  isLoading: false,
  error: null,

  fetchTransactions: async (month?: number, q?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (q) params.append('q', q);

      const res = await axios.get(`http://localhost:5000/transactions?${params.toString()}`, { withCredentials: true });
      set({
        transactions: res.data.history,
        summary: res.data.summary,
        isLoading: false,
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.response?.data?.message || err.message, 
        isLoading: false 
      });
    }
  },

  fetchHistory: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await axios.get(`http://localhost:5000/transactions/history?${params.toString()}`, { withCredentials: true });
      set({
        historyTransactions: res.data.history,
        historySummary: res.data.summary,
        isLoading: false,
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.response?.data?.message || err.message, 
        isLoading: false 
      });
    }
  },

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('http://localhost:5000/transactions/dashboard', { withCredentials: true });
      set({
        dashboardData: res.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.response?.data?.message || err.message, 
        isLoading: false 
      });
    }
  },

  addTransaction: async (data: Partial<Transaction>) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('http://localhost:5000/transactions', data, { withCredentials: true });
      await get().fetchTransactions();
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.response?.data?.message || err.message, 
        isLoading: false 
      });
      throw err;
    }
  },

  updateTransaction: async (id: number, data: Partial<Transaction>) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`http://localhost:5000/transactions/${id}`, data, { withCredentials: true });
      await get().fetchTransactions();
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.response?.data?.message || err.message, 
        isLoading: false 
      });
      throw err;
    }
  },

  deleteTransaction: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`http://localhost:5000/transactions/${id}`, { withCredentials: true });
      await get().fetchTransactions();
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.response?.data?.message || err.message, 
        isLoading: false 
      });
      throw err;
    }
  }
}));
