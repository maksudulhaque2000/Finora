'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });

      const payload = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !payload.success) {
        setError(payload.error ?? 'Registration failed.');
        return;
      }

      router.push('/login');
      router.refresh();
    });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="glass-panel w-full max-w-md rounded-[30px] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-light">Start fresh</p>
          <h1 className="mt-4 font-display text-4xl text-white">Create your Finora account</h1>
          <p className="mt-3 text-sm text-white/60">Create a secure profile and your first organization in one step.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="At least 8 characters" required />
            </div>
            <div>
              <Label htmlFor="organizationName">Organization name</Label>
              <Input id="organizationName" name="organizationName" placeholder="Finora Family Office" required />
            </div>
            <div>
              <Label htmlFor="organizationType">Organization type</Label>
              <Select id="organizationType" name="organizationType" defaultValue="BUSINESS">
                <option value="FAMILY">Family</option>
                <option value="BUSINESS">Business</option>
                <option value="NGO">NGO</option>
                <option value="PERSONAL">Personal</option>
              </Select>
            </div>
            {error ? <p className="rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
            <Button type="submit" disabled={isPending} className="w-full bg-gold text-black hover:bg-gold-light">
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-light hover:text-gold">
              Sign in
            </Link>
          </p>
        </div>
      </section>
      <aside className="hidden items-center justify-center border-l border-white/10 bg-black/25 px-12 py-12 lg:flex">
        <div className="max-w-lg">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-light">Built for clarity</p>
          <h2 className="mt-4 font-display text-5xl text-white">A clean foundation for dashboards, reports, and control.</h2>
          <p className="mt-6 text-lg leading-8 text-white/62">
            The onboarding flow creates your first organization immediately so you can start tracking financial activity without extra setup steps.
          </p>
        </div>
      </aside>
    </main>
  );
}