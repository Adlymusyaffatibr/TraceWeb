"use client"

import { useExpenseStore } from "@/store/expenseStore"

export default function Dashboard() {

  const { balance } = useExpenseStore()

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-zinc-500">Balance</h2>
          <p className="text-2xl font-bold">
            Rp {balance}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-zinc-500">Income</h2>
          <p className="text-2xl font-bold text-green-600">
            Rp 0
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-zinc-500">Expense</h2>
          <p className="text-2xl font-bold text-red-600">
            Rp 0
          </p>
        </div>

      </div>

    </div>
  )
}