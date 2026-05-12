import { ArrowUpRight, Plus } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { TransactionTable } from '@/components/transaction-table';
import { TransactionForm } from '@/components/transaction-form';

const incomeRows = [
  { id: '1', type: 'INCOME' as const, amount: 86000, description: 'Monthly salary', category: 'Salary', date: new Date() },
  { id: '2', type: 'INCOME' as const, amount: 45000, description: 'Client retainer', category: 'Business', date: new Date(Date.now() - 86400000) }
];

export default function IncomePage() {
  return (
    <PageShell
      title="Income"
      description="Record, review, and export income entries with a clean workflow and professional presentation."
      actions={
        <Button className="bg-gold text-black hover:bg-gold-light">
          <Plus className="h-4 w-4" />
          Add income
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <TransactionForm
          type="INCOME"
          categories={[{ id: 'salary', name: 'Salary' }, { id: 'business', name: 'Business' }]}
        />
        <TransactionTable title="Income entries" rows={incomeRows} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-panel rounded-[24px] p-5">
          <ArrowUpRight className="h-5 w-5 text-emerald" />
          <p className="mt-4 text-sm text-white/60">Total income this month</p>
          <p className="mt-2 font-mono text-3xl text-white">BDT 131,000</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Most active source</p>
          <p className="mt-2 text-xl text-white">Salary</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Average entry</p>
          <p className="mt-2 text-xl text-white">BDT 65,500</p>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <p className="text-sm text-white/60">Attachments uploaded</p>
          <p className="mt-2 text-xl text-white">2 receipts</p>
        </div>
      </div>
    </PageShell>
  );
}