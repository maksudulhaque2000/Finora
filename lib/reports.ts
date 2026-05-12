import { prisma } from '@/lib/prisma';
import { buildBalanceSheet, buildLedger, calculateSummary, groupByCategory } from '@/lib/finance';

export async function getReportDataset(organizationId: string, from?: Date, to?: Date) {
  const dateFilter = from || to
    ? {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {})
      }
    : undefined;

  const [transactions, assets, liabilities] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        organizationId,
        ...(dateFilter ? { date: dateFilter } : {})
      },
      include: { category: true },
      orderBy: { date: 'asc' }
    }),
    prisma.asset.findMany({ where: { organizationId } }),
    prisma.liability.findMany({ where: { organizationId } })
  ]);

  const summary = calculateSummary(transactions);
  const ledger = buildLedger(transactions);
  const categoryBreakdown = groupByCategory(transactions);
  const assetTotal = assets.reduce((total: number, asset: typeof assets[0]) => total + Number(asset.value), 0);
  const liabilityTotal = liabilities.reduce((total: number, liability: typeof liabilities[0]) => total + Number(liability.balance), 0);
  const balanceSheet = buildBalanceSheet(assetTotal, liabilityTotal);

  return {
    transactions,
    assets,
    liabilities,
    summary,
    ledger,
    categoryBreakdown,
    balanceSheet
  };
}