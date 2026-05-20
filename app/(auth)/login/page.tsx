'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Facebook, Mail } from 'lucide-react';
import { getProviders, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [socialProviders, setSocialProviders] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const providers = await getProviders();
        const enabled = Object.values(providers ?? {}).filter((provider) => provider.id !== 'credentials');
        setSocialProviders(enabled.map((provider) => ({ id: provider.id, name: provider.name })));
      } catch (err) {
        // If providers fail to load (network/SSR issue), keep UI functional without social buttons
        console.error('Failed to load auth providers', err);
        setSocialProviders([]);
      }
    })();
  }, []);

  function socialIcon(providerId: string) {
    if (providerId === 'google') {
      return <Mail className="h-4 w-4" />;
    }
    if (providerId === 'facebook') {
      return <Facebook className="h-4 w-4" />;
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await signIn('credentials', {
        redirect: false,
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? '')
      });

      if (result?.error) {
        setError('Invalid email or password.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="glass-panel w-full max-w-md rounded-[30px] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-light">Welcome back</p>
          <h1 className="mt-4 font-display text-4xl text-white">Sign in to Finora</h1>
          <p className="mt-3 text-sm text-white/60">Securely continue your financial workspace with a fast, professional experience.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            {error ? <p className="rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
            <Button type="submit" disabled={isPending} className="w-full bg-gold text-black hover:bg-gold-light">
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {socialProviders.length > 0 ? (
            <div className="mt-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Or continue with</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.id}
                    type="button"
                    variant="outline"
                    className="w-full justify-center"
                    onClick={async () => {
                      try {
                        await signIn(provider.id, { redirectTo: '/dashboard' });
                      } catch (err) {
                        console.error('Social sign-in failed', err);
                        setError('Social sign-in failed. Please try again.');
                      }
                    }}
                  >
                    {socialIcon(provider.id)}
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-sm text-white/60">
            New here?{' '}
            <Link href="/register" className="text-gold-light hover:text-gold">
              Create an account
            </Link>
          </p>
        </div>
      </section>
      <aside className="hidden items-center justify-center border-l border-white/10 bg-black/25 px-12 py-12 lg:flex">
        <div className="max-w-lg">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-light">Secure access</p>
          <h2 className="mt-4 font-display text-5xl text-white">Fast, protected, and ready for serious finance workflows.</h2>
          <p className="mt-6 text-lg leading-8 text-white/62">
            Finora protects routes, sanitizes form input, and keeps errors readable so your team can stay focused on financial clarity.
          </p>
        </div>
      </aside>
    </main>
  );
}