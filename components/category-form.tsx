'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

export function CategoryForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'INCOME',
      color: '#d4a853',
      icon: 'Tag'
    }
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; issues?: Array<{ message: string }> } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.issues?.[0]?.message ?? 'Category save failed.');
        }

        router.push('/dashboard/categories');
        router.refresh();
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Category save failed.';
        setError(message);
        // eslint-disable-next-line no-console
        console.error('Category submit failed', submitError);
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
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input id="color" type="color" className="h-11 w-full p-2" {...form.register('color')} />
        </div>
        <div>
          <Label htmlFor="icon">Icon name</Label>
          <Input id="icon" {...form.register('icon')} />
        </div>
      </div>
      {error ? <p className="mt-4 rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold-light">
          Save category
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
          Cancel
        </Button>
      </div>
    </form>
  );
}
