'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/format';

export function AmountDisplay({ amount, currency = 'BDT' }: { amount: number; currency?: string }) {
  const [visibleAmount, setVisibleAmount] = useState(0);

  useEffect(() => {
    const start = window.setTimeout(() => setVisibleAmount(amount), 80);
    return () => window.clearTimeout(start);
  }, [amount]);

  return <span className="font-mono tabular-nums">{formatCurrency(visibleAmount, currency)}</span>;
}