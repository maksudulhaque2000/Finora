'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => setIsOffline(!window.navigator.onLine);
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center border-b border-white/10 bg-crimson/90 px-4 py-2 text-sm text-white backdrop-blur-xl">
      <WifiOff className="mr-2 h-4 w-4" />
      You are offline. Finora will keep the interface available and retry requests automatically.
    </div>
  );
}