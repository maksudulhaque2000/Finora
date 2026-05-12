"use client";

import React from 'react';
import { formatCurrency } from '@/lib/format';

export function AmountDynamic({
  value,
  baseRem = 2.5,
  className
}: {
  value: number;
  baseRem?: number; // base font size in rem
  className?: string;
}) {
  const formatted = formatCurrency(value);
  // count digits (ignore non-digits)
  const digitCount = (formatted.match(/\d/g) || []).length;

  // reduce font-size slightly for large numbers to avoid wrapping
  // for each extra digit beyond 6, reduce by 0.06rem, floor at 0.9rem
  const extra = Math.max(0, digitCount - 6);
  const size = Math.max(0.9, baseRem - extra * 0.06);

  return (
    <span
      style={{ fontSize: `${size}rem`, lineHeight: 1 }}
      className={[
        'font-mono tabular-nums leading-none tracking-tight text-white',
        className
      ].filter(Boolean).join(' ')}
      title={formatted}
    >
      {formatted}
    </span>
  );
}

export default AmountDynamic;
