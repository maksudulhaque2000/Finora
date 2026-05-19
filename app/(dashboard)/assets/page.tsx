import Link from 'next/link';
import { Plus } from 'lucide-react';
import AmountDynamic from '@/components/amount-dynamic';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';
import { EmptyState } from '@/components/empty-state';

import { prisma } from '@/lib/prisma';
import { getWorkspace } from '@/lib/workspace';

export default async function AssetsPage() {
  const { organization } = await getWorkspace();

  const assets = await prisma.asset.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: 'desc' }
  });

  const assetTotal = assets.reduce((total, asset) => total + Number(asset.value), 0);
  const cashHoldings = assets.filter((asset) => asset.type === 'CASH' || asset.type === 'BANK').reduce((total, asset) => total + Number(asset.value), 0);
  const fixedAssets = assets.filter((asset) => asset.type === 'PROPERTY' || asset.type === 'EQUIPMENT' || asset.type === 'VEHICLE').reduce((total, asset) => total + Number(asset.value), 0);
  const liquidAssets = assetTotal - fixedAssets;

  return (
    <PageShell
      title="Assets"
      description="Track tangible and liquid assets with a clean summary and room for depreciation notes."
      actions={
        <Button asChild className="bg-gold text-black hover:bg-gold-light">
          <Link href="/dashboard/assets/new">
            <Plus className="h-4 w-4" />
            Add asset
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <FinancialCard title="Total asset value" amount={assetTotal} trend="Live" trendLabel="Latest snapshot" tone="positive" />
        <FinancialCard title="Cash holdings" amount={cashHoldings} trendLabel="Cash + bank" tone="neutral" />
        <FinancialCard title="Liquid assets" amount={liquidAssets} trendLabel="Assets minus fixed assets" tone="positive" />
        <FinancialCard title="Fixed assets" amount={fixedAssets} trendLabel="Property, equipment, vehicle" tone="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-white">Asset register</h3>
          <div className="mt-4 space-y-3">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div>
                    <p className="text-white">{asset.name}</p>
                    <p className="mt-1 text-sm text-white/50">{asset.type}</p>
                  </div>
                  <div className="text-right">
                    <AmountDynamic value={Number(asset.value)} baseRem={1.1} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-10 text-center text-sm text-white/55">
                No assets have been recorded yet.
              </div>
            )}
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