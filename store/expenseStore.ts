import { create } from "zustand"

interface ExpenseState {
  balance: number
  transactions: any[]
  addTransaction: (data:any) => void
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  balance: 0,
  transactions: [],

  addTransaction: (data) =>
    set((state) => ({
      transactions: [...state.transactions, data],
      balance: state.balance + data.amount
    }))
}))