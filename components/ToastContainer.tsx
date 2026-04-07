'use client';

import React, { useEffect, useState } from 'react';
import { useToastStore, Toast, ToastType } from '@/store/toastStore';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <div className="bg-[#10b981] w-8 h-8 rounded-full flex items-center justify-center shadow-[0px_4px_10px_rgba(16,185,129,0.3)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  ),
  error: (
    <div className="bg-[#f87171] w-8 h-8 rounded-full flex items-center justify-center shadow-[0px_4px_10px_rgba(248,113,113,0.3)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  ),
  warning: (
    <div className="bg-[#fbbf24] w-8 h-8 rounded-full flex items-center justify-center shadow-[0px_4px_10px_rgba(251,191,36,0.3)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
  ),
};

const STYLES: Record<ToastType, { bg: string; border: string; bar: string; title: string }> = {
  success: {
    bg:     'bg-[#f0fdf4]',
    border: 'border-[#dcfce7]',
    bar:    'bg-[#10b981]',
    title:  'Congratulations!'
  },
  error: {
    bg:     'bg-[#fef2f2]',
    border: 'border-[#fee2e2]',
    bar:    'bg-[#f87171]',
    title:  'Something went wrong!'
  },
  warning: {
    bg:     'bg-[#fffbeb]',
    border: 'border-[#fef3c7]',
    bar:    'bg-[#fbbf24]',
    title:  'Warning'
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const s = STYLES[toast.type];

  // Slide-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Trigger slide-out 400ms before auto-remove
  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => removeToast(toast.id), 400);
    }, 3600);
    return () => clearTimeout(t);
  }, [toast.id, removeToast]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => removeToast(toast.id), 400);
  };

  return (
    <div
      className={`
        relative flex items-center gap-4 px-5 py-4 rounded-[20px] shadow-[0px_10px_30px_rgba(0,0,0,0.04)] w-[400px] overflow-hidden
        ${s.bg} border ${s.border}
        transition-all duration-400 ease-in-out
        ${visible && !leaving ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
      `}
      style={{ transitionProperty: 'transform, opacity' }}
    >
      {/* Icon */}
      <div className="shrink-0">
        {ICONS[toast.type]}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[14px] font-bold text-gray-800 leading-tight">
          {s.title}
        </p>
        <p className="text-[12px] font-medium text-gray-500 mt-1 leading-snug">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition hover:bg-gray-200/50 rounded-lg"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Progress bar */}
      <div className={`absolute bottom-0 left-0 h-[3px] opacity-20 ${s.bar} animate-toast-shrink`} />
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 pointer-events-none">
      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .animate-toast-shrink {
          animation: toast-shrink 4s linear forwards;
        }
        .duration-400 {
          transition-duration: 400ms;
        }
      `}</style>
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
