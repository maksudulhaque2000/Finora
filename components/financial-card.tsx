import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import AmountDynamic from '@/components/amount-dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FinancialCardProps = {
  title: string;
  amount: number;
  trend?: string;
  trendLabel?: string;
  tone?: 'positive' | 'negative' | 'neutral';
  compact?: boolean;
};

export function FinancialCard({ title, amount, trend, trendLabel, tone = 'neutral', compact = false }: FinancialCardProps) {
  const toneClasses = {
    positive: 'text-emerald',
    negative: 'text-crimson',
    neutral: 'text-white'
  };

  return (
    <Card className={cn('border-white/10', compact ? 'p-0' : '')}>
      <CardContent className={cn('min-w-0', compact ? 'p-4' : 'p-6')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-white/60">{title}</p>
          </div>
          {trend ? (
            <div className={cn('inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold', toneClasses[tone])}>
              {tone === 'negative' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              {trend}
            </div>
          ) : null}
        </div>
        <div className="mt-3 min-w-0">
          <AmountDynamic value={amount} baseRem={compact ? 1.65 : 2.5} />
        </div>
        {trendLabel ? <p className="mt-3 text-xs text-white/45">{trendLabel}</p> : null}
      </CardContent>
    </Card>
  );
}