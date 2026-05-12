import { Plus, ReceiptText } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { TransactionTable } from '@/components/transaction-table';
import { TransactionForm } from '@/components/transaction-form';

const expenseRows = [
  { id: '1', type: 'EXPENSE' as const, amount: 12800, description: 'Office rent', category: 'Rent', date: new Date() },
  { id: '2', type: 'EXPENSE' as const, amount: 6400, description: 'Cloud infrastructure', category: 'Operations', date: new Date(Date.now() - 86400000) },
  { id: '3', type: 'EXPENSE' as const, amount: 2100, description: 'Team lunch', category: 'Food', date: new Date(Date.now() - 172800000) }
];

export default function ExpensesPage() {
  return (
    <PageShell
      title="Expenses"
      description="Manage operational spending, recurring bills, and receipts with calm, readable controls."
      actions={
        <Button className="bg-gold text-black hover:bg-gold-light">
          <Plus className="h-4 w-4" />
          Add expense
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <TransactionForm
          type="EXPENSE"
          categories={[{ id: 'rent', name: 'Rent' }, { id: 'operations', name: 'Operations' }, { id: 'food', name: 'Food' }]}
        />
        <TransactionTable title="Expense entries" rows={expenseRows} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-panel rounded-[24px] p-5">
          <ReceiptText className="h-5 w-5 text-crimson" />
          <p className="mt-4 text-sm text-white/60">Recurring expenses</p>
          <p className="mt-2 text-xl text-white">4 active rules</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Largest category</p>
          <p className="mt-2 text-xl text-white">Rent</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Receipt&apos;s coverage</p>
          <p className="mt-2 text-xl text-white">92%</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">This month&apos;s spend</p>
          <p className="mt-2 font-mono text-3xl text-white">BDT 21,300</p>
        </div>
      </div>
    </PageShell>
  );
}