import Link from 'next/link';
import { Plus, ShieldAlert } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import AmountDynamic from '@/components/amount-dynamic';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';
import { EmptyState } from '@/components/empty-state';

import { getReportDataset } from '@/lib/reports';
import { getWorkspace } from '@/lib/workspace';

export default async function LiabilitiesPage() {
  const { organization } = await getWorkspace();
  const report = await getReportDataset(organization.id);
  const liabilities = report.liabilities;

  const totalLiabilities = liabilities.reduce((total, liability) => total + Number(liability.balance), 0);
  const monthlyRepayment = liabilities.reduce((total, liability) => total + Number(liability.monthlyInstallment ?? 0), 0);
  const openObligations = liabilities.length;

  return (
    <PageShell
      title="Liabilities"
      description="Monitor loans, payables, and dues with clear schedules and balance-risk visibility."
      actions={
        <Button asChild className="bg-gold text-black hover:bg-gold-light">
          <Link href="/dashboard/liabilities/new">
            <Plus className="h-4 w-4" />
            Add liability
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <FinancialCard title="Total liabilities" amount={totalLiabilities} trendLabel="Latest snapshot" tone="negative" />
        <FinancialCard title="Monthly repayment" amount={monthlyRepayment} trendLabel="Scheduled" tone="neutral" />
        <FinancialCard title="Asset ratio" amount={Math.round(report.balanceSheet.ratio)} trendLabel="Assets vs liabilities" tone="positive" />
        <FinancialCard title="Open obligations" amount={openObligations} trendLabel="Active items" tone="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-white">Liability schedule</h3>
          <div className="mt-4 space-y-3">
            {liabilities.length > 0 ? (
              liabilities.map((liability) => (
                <div key={liability.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white">{liability.name}</p>
                      <p className="mt-1 text-sm text-white/50">Due {liability.dueDate ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(liability.dueDate)) : 'Not scheduled'}</p>
                    </div>
                    <ShieldAlert className="h-5 w-5 text-crimson" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Balance</p>
                      <p className="mt-1">
                        <AmountDynamic value={Number(liability.balance)} baseRem={1.05} />
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Installment</p>
                      <p className="mt-1">
                        <AmountDynamic value={Number(liability.monthlyInstallment ?? 0)} baseRem={1.05} />
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-10 text-center text-sm text-white/55">
                No liabilities have been recorded yet.
              </div>
            )}
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