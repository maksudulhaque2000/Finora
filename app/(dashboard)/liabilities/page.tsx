import { Plus, ShieldAlert } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';
import { EmptyState } from '@/components/empty-state';

const liabilities = [
  { name: 'Working capital loan', balance: 240000, installment: 15000, due: '15 Jun 2026' },
  { name: 'Vendor payable', balance: 42000, installment: 7000, due: '30 May 2026' }
];

export default function LiabilitiesPage() {
  return (
    <PageShell
      title="Liabilities"
      description="Monitor loans, payables, and dues with clear schedules and balance-risk visibility."
      actions={
        <Button className="bg-gold text-black hover:bg-gold-light">
          <Plus className="h-4 w-4" />
          Add liability
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FinancialCard title="Total liabilities" amount={282000} trend="-2.4%" trendLabel="Latest snapshot" tone="negative" />
        <FinancialCard title="Monthly repayment" amount={22000} trendLabel="Scheduled" tone="neutral" />
        <FinancialCard title="Asset ratio" amount={82} trendLabel="Assets vs liabilities" tone="positive" />
        <FinancialCard title="Open obligations" amount={2} trendLabel="Active items" tone="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-white">Liability schedule</h3>
          <div className="mt-4 space-y-3">
            {liabilities.map((liability) => (
              <div key={liability.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white">{liability.name}</p>
                    <p className="mt-1 text-sm text-white/50">Due {liability.due}</p>
                  </div>
                  <ShieldAlert className="h-5 w-5 text-crimson" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Balance</p>
                    <p className="mt-1 font-mono text-white">BDT {liability.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Installment</p>
                    <p className="mt-1 font-mono text-white">BDT {liability.installment.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <EmptyState
          title="Risk visibility"
          description="Keep liabilities, dues, and repayment plans visible beside your asset position so balance pressure is never hidden."
          iconName="ShieldAlert"
          actionLabel="Create liability"
          actionHref="/dashboard/liabilities/new"
        />
      </div>
    </PageShell>
  );
}