'use client';

import { useEffect, useState } from 'react';
import AmountDynamic from '@/components/amount-dynamic';

export function AmountDisplay({ amount }: { amount: number }) {
  const [visibleAmount, setVisibleAmount] = useState(0);

  useEffect(() => {
    const start = window.setTimeout(() => setVisibleAmount(amount), 80);
    return () => window.clearTimeout(start);
  }, [amount]);

  return <AmountDynamic value={visibleAmount} baseRem={1.1} />;
}