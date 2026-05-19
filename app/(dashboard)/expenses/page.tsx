import Link from 'next/link';
import { Plus, ReceiptText } from 'lucide-react';
import AmountDynamic from '@/components/amount-dynamic';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { TransactionTable } from '@/components/transaction-table';
import { TransactionForm } from '@/components/transaction-form';
import { prisma } from '@/lib/prisma';
import { getWorkspace } from '@/lib/workspace';

export default async function ExpensesPage() {
  const { organization } = await getWorkspace();

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({
      where: { organizationId: organization.id, type: 'EXPENSE' },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.transaction.findMany({
      where: { organizationId: organization.id, type: 'EXPENSE' },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 12
    })
  ]);

  const expenseRows = transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount),
    description: transaction.description,
    category: transaction.category?.name ?? 'Uncategorized',
    date: transaction.date
  }));

  const totalExpense = expenseRows.reduce((total, row) => total + row.amount, 0);
  const recurringCount = transactions.filter((transaction) => transaction.isRecurring).length;
  const receiptCoverage = transactions.length > 0 ? Math.round((transactions.filter((transaction) => Boolean(transaction.receiptUrl)).length / transactions.length) * 100) : 0;
  const categoryTotals = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const key = transaction.category?.name ?? 'Uncategorized';
    accumulator[key] = (accumulator[key] ?? 0) + Number(transaction.amount);
    return accumulator;
  }, {});
  const largestCategory = Object.entries(categoryTotals).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'No transactions yet';

  return (
    <PageShell
      title="Expenses"
      description="Manage operational spending, recurring bills, and receipts with calm, readable controls."
      actions={
        <Button asChild className="bg-gold text-black hover:bg-gold-light">
          <Link href="#expense-form">
            <Plus className="h-4 w-4" />
            Add expense
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div id="expense-form">
          <TransactionForm type="EXPENSE" categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
        </div>
        <TransactionTable title="Expense entries" rows={expenseRows} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div className="glass-panel rounded-[24px] p-5">
          <ReceiptText className="h-5 w-5 text-crimson" />
          <p className="mt-4 text-sm text-white/60">Recurring expenses</p>
          <p className="mt-2 text-xl text-white">{recurringCount} active rules</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Largest category</p>
          <p className="mt-2 text-xl text-white">{largestCategory}</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Receipt&apos;s coverage</p>
          <p className="mt-2 text-xl text-white">{receiptCoverage}%</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">This month&apos;s spend</p>
          <p className="mt-2">
            <AmountDynamic value={totalExpense} baseRem={2.2} />
          </p>
        </div>
      </div>
    </PageShell>
  );
}