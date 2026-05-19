"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'info';
  duration?: number;
};

type ToastContextValue = {
  showToast: (t: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
    const toast: Toast = { id, duration: 5000, ...t };
    setToasts((s) => [toast, ...s]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const timers = toasts.map((t) => {
      if (!t.duration) return null;
      const timer = setTimeout(() => dismissToast(t.id), t.duration);
      return timer;
    });
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [toasts, dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && typeof window !== 'undefined'
        ? createPortal(
            <div className="fixed top-24 right-4 z-[99999] flex max-w-full flex-col items-end gap-3 px-4">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  role="status"
                  aria-live="polite"
                  className={`w-auto max-w-xs rounded-lg px-4 py-3 shadow-xl transform-gpu transition-all duration-300 ease-out flex items-start gap-3 md:max-w-md ${
                    toast.variant === 'success'
                      ? 'bg-emerald-600 border-emerald-700 text-white'
                      : toast.variant === 'error'
                      ? 'bg-rose-600 border-rose-700 text-white'
                      : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {toast.variant === 'success' ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M7.5 13.5L4.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.5 13.5L15.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : toast.variant === 'error' ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M10 6.25V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 13.75H10.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {toast.title ? <div className="font-semibold text-sm leading-5">{toast.title}</div> : null}
                    {toast.description ? <div className="mt-1 text-sm text-white/90 leading-5">{toast.description}</div> : null}
                  </div>
                </div>
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
