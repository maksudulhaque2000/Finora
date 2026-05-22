"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickNavigator() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail !== 'string' || !detail.startsWith('/')) return;
      router.push(detail);
    };

    window.addEventListener('quick:navigate', handler as EventListener);
    return () => window.removeEventListener('quick:navigate', handler as EventListener);
  }, [router]);

  return null;
}
