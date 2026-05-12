import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatShortDate } from '@/lib/format';
import { BalanceIndicator } from '@/components/balance-indicator';

export type TransactionRow = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description: string;
  category: string;
  date: string | Date;
};

export function TransactionTable({
  title,
  rows,
  currency = 'BDT',
  emptyMessage = 'No transactions available yet.'
}: {
  title: string;
  rows: TransactionRow[];
  currency?: string;
  emptyMessage?: string;
}) {
  const hasRows = rows.length > 0;

  return (
    <div className="glass-panel overflow-hidden rounded-[28px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/52">Sortable, filter-ready transaction overview with instant balance context.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button asChild className="bg-gold text-black hover:bg-gold-light">
            <Link href="/reports">Export</Link>
          </Button>
        </div>
      </div>

      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8 text-left text-sm">
            <thead className="bg-white/5 text-white/55">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <Badge className="gap-2">
                      {row.type === 'INCOME' ? <ArrowUpRight className="h-4 w-4 text-emerald" /> : <ArrowDownRight className="h-4 w-4 text-crimson" />}
                      {row.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-white/85">{row.description}</td>
                  <td className="px-6 py-4 text-white/62">{row.category}</td>
                  <td className="px-6 py-4 text-white/62">{formatShortDate(row.date)}</td>
                  <td className="px-6 py-4 text-right font-mono text-white">
                    <BalanceIndicator balance={row.type === 'EXPENSE' ? -row.amount : row.amount} currency={currency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-14 text-center text-white/55">{emptyMessage}</div>
      )}
    </div>
  );
}