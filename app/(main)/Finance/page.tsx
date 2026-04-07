'use client';

import React, { useEffect, useState } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import StatsSkeleton from '@/components/skeletons/StatsSkeleton';
import TransactionItemSkeleton from '@/components/skeletons/TransactionItemSkeleton';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

export default function DashboardPage() {
  const { dashboardData, isLoading, error, fetchDashboard } = useTransactionStore();
  const router = useRouter();
  
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return 'Rp 0';
    return `Rp ${Math.floor(amount).toLocaleString('id-ID')}`;
  };

  const formatDateWithTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Simplistic "Today/Yesterday" logic
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return `Today, ${hours}:${minutes} ${ampm}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${hours}:${minutes} ${ampm}`;
    }

    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  // Chart Configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937', // gray-800
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, weight: 'bold' as const, family: "'Inter', sans-serif" },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6', // gray-100
        },
        border: { display: false },
        ticks: {
          color: '#9ca3af', // gray-400
          font: { size: 11, family: "'Inter', sans-serif" },
          maxTicksLimit: 6,
          callback: function(value: any) {
             if (value === 0) return '0';
             return value >= 1000000 ? (value / 1000000) + 'M' : value >= 1000 ? (value / 1000) + 'k' : value;
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        border: { display: false },
        ticks: {
          color: '#9ca3af', // gray-400
          font: { size: 12, family: "'Inter', sans-serif", weight: 600 }
        }
      }
    },
    hover: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  const chartDataConfig = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: dashboardData?.chartData?.income || new Array(12).fill(0),
        backgroundColor: '#dcfce7', // Green
        hoverBackgroundColor: '#86efac', 
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: 'Expense',
        data: dashboardData?.chartData?.expense || new Array(12).fill(0),
        backgroundColor: '#ffcfd7', // Red
        hoverBackgroundColor: '#fda4af', 
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  return (
    <div className="p-8 bg-[#f5f5f5] min-h-screen text-gray-800 flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      <h1 className="text-[26px] font-bold mb-1">Hello, Sarah!</h1>
      <p className="text-gray-400 text-sm mb-6">
        Traces of your saving adventure today
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm mb-4">
          Error: {error}
        </div>
      )}

      {/* TOP CARDS */}
      {isLoading || !dashboardData ? (
        <StatsSkeleton />
      ) : (
        <div className="flex gap-4 mb-6 h-[220px]">
          {/* Card 1: Total Balance */}
          <div className="bg-[#4a4a4a] text-white p-7 w-[45%] rounded-[24px] flex flex-col justify-between shadow-sm relative overflow-hidden">
             <div>
               <p className="text-gray-400 font-medium text-sm mb-2 flex items-center gap-2">
                 Total Balance
               </p>
               <div className="flex items-center gap-3">
                 <h2 className="text-[40px] font-bold tracking-tight">
                   {isBalanceVisible ? formatCurrency(dashboardData.summary.total_balance) : 'Rp ••••••••'}
                 </h2>
                 <button 
                   onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                   className="text-gray-400 hover:text-white transition mt-2"
                 >
                   {isBalanceVisible ? <EyeOffIcon /> : <EyeIcon />}
                 </button>
               </div>
             </div>
             {/* Note: Dummy comparison data for visual fidelity with design */}
             <div className="bg-[#3a3a3a] px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 inline-flex items-center self-start border border-[#555]">
                Higher than last month by <span className="text-[#a3e635] ml-1">Rp 25.000</span>
             </div>
          </div>

          {/* Cards 2 & 3 Container */}
          <div className="flex gap-4 w-[55%]">
            {/* Total Income */}
            <div className="bg-white p-7 rounded-[24px] flex-1 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                 <p className="text-gray-400 font-medium text-sm">Total Income</p>
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                 </div>
              </div>
              <div>
                <h2 className="text-[28px] font-bold tracking-tight text-gray-800">
                  {formatCurrency(dashboardData.summary.total_income)}
                </h2>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="bg-white p-7 rounded-[24px] flex-1 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                 <p className="text-gray-400 font-medium text-sm">Total Expenses</p>
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6M21 12A9 9 0 0 0 6 5.3L3 8"></path></svg>
                 </div>
              </div>
              <div>
                <h2 className="text-[28px] font-bold tracking-tight text-gray-800">
                  {formatCurrency(dashboardData.summary.total_expense)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SECTION */}
      <div className="flex gap-4 flex-1 overflow-hidden min-h-[400px]">
        
        {/* CHART SECTION */}
        <div className="w-[60%] bg-white rounded-[24px] p-7 shadow-sm flex flex-col">
          <div className="mb-6">
            <p className="text-gray-400 font-medium text-[13px] mb-1">Available Balance</p>
            {isLoading || !dashboardData ? (
               <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <h2 className="text-[28px] font-bold tracking-tight text-gray-600">
                {isBalanceVisible ? formatCurrency(dashboardData.summary.total_balance) : 'Rp ••••••••'}
              </h2>
            )}
          </div>
          <div className="flex-1 w-full relative">
            {isLoading || !dashboardData ? (
                <div className="absolute inset-0 bg-gray-50 animate-pulse rounded-xl"></div>
            ) : (
                <Bar options={options} data={chartDataConfig} />
            )}
          </div>
        </div>

        {/* OUTGOING HISTORY */}
        <div className="w-[40%] bg-white rounded-[24px] p-7 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-500 text-sm">Outgoing History</h3>
            <button 
              onClick={() => router.push('/Finance/transactions')}
              className="text-[13px] font-bold text-gray-400 hover:text-gray-700 transition"
            >
              View All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {isLoading || !dashboardData ? (
               Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="flex gap-4 items-center">
                   <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                   <div className="flex-1 space-y-2">
                     <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
                     <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2"></div>
                   </div>
                 </div>
               ))
            ) : dashboardData.outgoingHistory.length === 0 ? (
               <div className="h-full flex items-center justify-center text-sm font-medium text-gray-400 flex-col gap-2">
                 <span className="text-2xl">🍃</span>
                 No outgoing history yet.
               </div>
            ) : (
              dashboardData.outgoingHistory.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-gray-100 border border-transparent group-hover:border-gray-200">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-gray-800 truncate mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-[12px] font-medium text-gray-400">
                      {formatDateWithTime(item.date)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}