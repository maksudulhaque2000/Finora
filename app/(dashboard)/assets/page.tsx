import { Plus } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';
import { EmptyState } from '@/components/empty-state';

const assets = [
  { name: 'Cash on hand', type: 'CASH', value: 65000 },
  { name: 'Business bank account', type: 'BANK', value: 840000 },
  { name: 'Equipment', type: 'EQUIPMENT', value: 380000 }
];

export default function AssetsPage() {
  return (
    <PageShell
      title="Assets"
      description="Track tangible and liquid assets with a clean summary and room for depreciation notes."
      actions={
        <Button className="bg-gold text-black hover:bg-gold-light">
          <Plus className="h-4 w-4" />
          Add asset
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FinancialCard title="Total asset value" amount={1285000} trend="+6.1%" trendLabel="Latest snapshot" tone="positive" />
        <FinancialCard title="Cash holdings" amount={65000} trend="+1.2%" trendLabel="Today" tone="neutral" />
        <FinancialCard title="Bank balance" amount={840000} trend="+9.4%" trendLabel="This month" tone="positive" />
        <FinancialCard title="Fixed assets" amount={380000} trend="+2.0%" trendLabel="This month" tone="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-white">Asset register</h3>
          <div className="mt-4 space-y-3">
            {assets.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <div>
                  <p className="text-white">{asset.name}</p>
                  <p className="mt-1 text-sm text-white/50">{asset.type}</p>
                </div>
                <p className="font-mono text-white">BDT {asset.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <EmptyState
          title="Asset strategy"
          description="Capture ownership details, purchase dates, and depreciation notes to preserve financial context across reporting cycles."
            iconName="Building2"
          actionLabel="Add asset"
          actionHref="/dashboard/assets/new"
        />
      </div>
    </PageShell>
  );
}