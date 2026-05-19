'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { liabilitySchema, type LiabilityValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function LiabilityForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LiabilityValues>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: {
      name: '',
      type: 'LOAN',
      principal: 0,
      interestRate: 0,
      monthlyInstallment: 0,
      balance: 0,
      description: ''
    }
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch('/api/liabilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; issues?: Array<{ message: string }> } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.issues?.[0]?.message ?? 'Liability save failed.');
        }

        router.push('/dashboard/liabilities');
        router.refresh();
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Liability save failed.';
        setError(message);
        // eslint-disable-next-line no-console
        console.error('Liability submit failed', submitError);
      }
    });
  });

  return (
    <form onSubmit={submit} className="glass-panel rounded-[28px] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register('name')} />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" {...form.register('type')}>
            <option value="LOAN">Loan</option>
            <option value="PAYABLE">Payable</option>
            <option value="DUE">Due</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="principal">Principal</Label>
          <Input id="principal" type="number" step="0.01" {...form.register('principal', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="balance">Balance</Label>
          <Input id="balance" type="number" step="0.01" {...form.register('balance', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest rate (%)</Label>
          <Input id="interestRate" type="number" step="0.01" {...form.register('interestRate', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="monthlyInstallment">Monthly installment</Label>
          <Input id="monthlyInstallment" type="number" step="0.01" {...form.register('monthlyInstallment', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" {...form.register('dueDate', { valueAsDate: true })} />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register('description')} />
      </div>
      {error ? <p className="mt-4 rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold-light">
          Save liability
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          Cancel
        </Button>
      </div>
    </form>
  );
}
