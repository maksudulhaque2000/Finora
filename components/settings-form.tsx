'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, type SettingsValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

export function SettingsForm({
  initialValues,
  formId = 'settings-form'
}: {
  initialValues: SettingsValues;
  formId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; issues?: Array<{ message: string }> } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.issues?.[0]?.message ?? 'Settings save failed.');
        }

        setSuccess('Settings saved successfully.');
        router.refresh();
        showToast({ title: 'Saved', description: 'Settings saved successfully.', variant: 'success' });
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Settings save failed.';
        setError(message);
        showToast({ title: 'Error', description: message, variant: 'error' });
        // eslint-disable-next-line no-console
        console.error('Settings submit failed', submitError);
      }
    });
  });

  return (
    <form id={formId} onSubmit={submit} className="space-y-4">
      <div className="glass-panel rounded-[28px] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register('email')} />
          </div>
          <div>
            <Label htmlFor="organizationName">Organization</Label>
            <Input id="organizationName" {...form.register('organizationName')} />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" {...form.register('currency')}>
              <option value="BDT">BDT</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="description">Organization description</Label>
          <Input id="description" {...form.register('description')} />
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
      {success ? <p className="rounded-2xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-emerald">{success}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending} className="bg-gold text-black hover:bg-gold-light">
          Save changes
        </Button>
      </div>
    </form>
  );
}
