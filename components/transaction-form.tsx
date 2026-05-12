'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function TransactionForm({
  type = 'INCOME',
  onSubmit,
  categories = [],
  onCancel
}: {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  categories: Array<{ id: string; name: string }>;
  onSubmit?: (values: TransactionValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      amount: 0,
      description: '',
      note: '',
      categoryId: categories[0]?.id ?? '',
      paymentMethod: '',
      isRecurring: false,
      recurringRule: ''
    }
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        try {
          await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          });
        } catch (e) {
          // keep console logging for local debugging
          // eslint-disable-next-line no-console
          console.error('Transaction submit failed', e);
        }
      }

      form.reset();
    });
  });

  return (
    <form onSubmit={submit} className="glass-panel rounded-[28px] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" {...form.register('categoryId')}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...form.register('description')} />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Input id="paymentMethod" {...form.register('paymentMethod')} />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...form.register('date', { valueAsDate: true })} />
        </div>
        <div>
          <Label htmlFor="receiptUrl">Receipt URL</Label>
          <Input id="receiptUrl" type="url" {...form.register('receiptUrl')} />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="note">Notes</Label>
        <Textarea id="note" {...form.register('note')} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold-light">
          Save transaction
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}