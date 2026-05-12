import { cn } from '@/lib/utils';
import AmountDynamic from '@/components/amount-dynamic';

export function BalanceIndicator({ balance }: { balance: number }) {
  const isPositive = balance >= 0;
  return (
    <span className={cn('inline-flex items-center whitespace-nowrap text-sm font-semibold', isPositive ? 'text-emerald' : 'text-crimson')}>
      <AmountDynamic value={balance} baseRem={1} />
    </span>
  );
}