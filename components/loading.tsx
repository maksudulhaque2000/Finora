"use client";

import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext<{ loading: boolean; setLoading: (v: boolean) => void } | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  // expose a global helper so inline script in layout can call navigation
  // no global helpers here; quick navigation handled by QuickNavigator client component
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading ? <LoadingOverlay /> : null}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pointer-events-none">
      <div className="w-full">
        <div className="h-1 w-full bg-white/8">
          <div className="h-1 bg-gold animate-loading" style={{ width: '40%' }} />
        </div>
      </div>
      <style>{`
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        .animate-loading { animation: loading 1.2s linear infinite; }
      `}</style>
    </div>
  );
}

export default LoadingProvider;
