"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickNavigator() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      router.push(String(detail));
    };

    window.addEventListener('quick:navigate', handler as EventListener);
    return () => window.removeEventListener('quick:navigate', handler as EventListener);
  }, [router]);

  return null;
}
