import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { TransactionTable } from '@/components/transaction-table';
import { TransactionForm } from '@/components/transaction-form';
import AmountDynamic from '@/components/amount-dynamic';
import { prisma } from '@/lib/prisma';
import { getWorkspace } from '@/lib/workspace';

export default async function IncomePage() {
  const { organization } = await getWorkspace();

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({
      where: { organizationId: organization.id, type: 'INCOME' },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.transaction.findMany({
      where: { organizationId: organization.id, type: 'INCOME' },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 12
    })
  ]);

  const incomeRows = transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount),
    description: transaction.description,
    category: transaction.category?.name ?? 'Uncategorized',
    date: transaction.date
  }));

  const totalIncome = incomeRows.reduce((total, row) => total + row.amount, 0);
  const attachmentsCount = transactions.filter((transaction) => Boolean(transaction.receiptUrl)).length;
  const averageEntry = incomeRows.length > 0 ? totalIncome / incomeRows.length : 0;
  const sourceTotals = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const key = transaction.category?.name ?? 'Uncategorized';
    accumulator[key] = (accumulator[key] ?? 0) + Number(transaction.amount);
    return accumulator;
  }, {});
  const topSource = Object.entries(sourceTotals).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'No transactions yet';

  return (
    <PageShell
      title="Income"
      description="Record, review, and export income entries with a clean workflow and professional presentation."
      actions={
        <Button asChild className="bg-gold text-black hover:bg-gold-light">
          <Link href="#income-form">
            <Plus className="h-4 w-4" />
            Add income
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div id="income-form">
          <TransactionForm type="INCOME" categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
        </div>
        <TransactionTable title="Income entries" rows={incomeRows} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div className="glass-panel rounded-[24px] p-5">
          <ArrowUpRight className="h-5 w-5 text-emerald" />
          <p className="mt-4 text-sm text-white/60">Total income this month</p>
          <p className="mt-2">
            <AmountDynamic value={totalIncome} baseRem={2.2} />
          </p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Most active source</p>
          <p className="mt-2 text-xl text-white">{topSource}</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Average entry</p>
          <p className="mt-2">
            <AmountDynamic value={averageEntry} baseRem={1.2} />
          </p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Attachments uploaded</p>
          <p className="mt-2 text-xl text-white">{attachmentsCount} receipts</p>
        </div>
      </div>
    </PageShell>
  );
}