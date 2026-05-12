import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
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
      <CardContent className={cn(compact ? 'p-4' : 'p-6')}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">{title}</p>
            <p className="mt-3 font-mono text-2xl tracking-tight text-white md:text-3xl">{formatCurrency(amount)}</p>
          </div>
          {trend ? (
            <div className={cn('inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold', toneClasses[tone])}>
              {tone === 'negative' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              {trend}
            </div>
          ) : null}
        </div>
        {trendLabel ? <p className="mt-3 text-xs text-white/45">{trendLabel}</p> : null}
      </CardContent>
    </Card>
  );
}