import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

export function BalanceIndicator({ balance, currency = 'BDT' }: { balance: number; currency?: string }) {
  const isPositive = balance >= 0;
  return (
    <span className={cn('font-mono text-sm font-semibold', isPositive ? 'text-emerald' : 'text-crimson')}>
      {formatCurrency(balance, currency)}
    </span>
  );
}