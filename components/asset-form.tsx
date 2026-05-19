'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetSchema, type AssetValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function AssetForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<AssetValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      type: 'CASH',
      value: 0,
      description: ''
    }
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; issues?: Array<{ message: string }> } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.issues?.[0]?.message ?? 'Asset save failed.');
        }

        router.push('/dashboard/assets');
        router.refresh();
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Asset save failed.';
        setError(message);
        // eslint-disable-next-line no-console
        console.error('Asset submit failed', submitError);
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
            <option value="CASH">Cash</option>
            <option value="BANK">Bank</option>
            <option value="PROPERTY">Property</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="INVENTORY">Inventory</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input id="value" type="number" step="0.01" {...form.register('value', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="purchaseDate">Purchase date</Label>
          <Input id="purchaseDate" type="date" {...form.register('purchaseDate', { valueAsDate: true })} />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register('description')} />
      </div>
      {error ? <p className="mt-4 rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold-light">
          Save asset
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          Cancel
        </Button>
      </div>
    </form>
  );
}
