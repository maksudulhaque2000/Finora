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
      if (typeof detail !== 'string' || !detail.startsWith('/')) return;

      try {
        // Prefetch the route to speed up navigation (some runtimes return void)
        router.prefetch(detail);
      } catch {
        // ignore
      }

      try {
        setLoading(true);
      } catch {}

      // Push the route; no await available for completion here
      router.push(detail);

      // fallback: hide loading after a short delay
      setTimeout(() => {
        try {
          setLoading(false);
        } catch {}
      }, 1100);
    };

    window.addEventListener('quick:navigate', handler as EventListener);
    return () => window.removeEventListener('quick:navigate', handler as EventListener);
  }, [router, setLoading]);

  return null;
}
