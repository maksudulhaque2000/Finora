"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/loading';

export default function QuickNavigator() {
  const router = useRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      try {
        setLoading(true);
        await router.push(String(detail));
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('quick:navigate', handler as EventListener);
    return () => window.removeEventListener('quick:navigate', handler as EventListener);
  }, [router, setLoading]);

  return null;
}
