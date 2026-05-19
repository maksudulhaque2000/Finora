'use client';

import Link from 'next/link';
import QuickLink from '@/components/ui/quick-link';
import { ArrowRight, ShieldCheck, Sparkles, LineChart, WalletCards } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';

const highlights = [
  { label: 'Secure accounting', icon: ShieldCheck, description: 'Protected workflows, role-based access, and audit-friendly data structure.' },
  { label: 'Real-time insight', icon: LineChart, description: 'Summary cards, charts, and ledger views tuned for speed and clarity.' },
  { label: 'Premium interface', icon: Sparkles, description: 'Dark luxury design with responsive motion and concise interactions.' },
  { label: 'Multi-entity ready', icon: WalletCards, description: 'Built for households, NGOs, organizations, and personal finance.' }
];

export default function HomePage() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const [snapshot, setSnapshot] = useState<{ income: number; expenses: number; balance: number } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setSnapshot(null);
      return;
    }

    let active = true;

    (async () => {
      try {
        const response = await fetch('/api/reports/summary');
        const payload = (await response.json().catch(() => null)) as { data?: { income?: number; expenses?: number; balance?: number }; error?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Failed to load financial snapshot.');
        }

        if (active) {
          setSnapshot({
            income: Number(payload?.data?.income ?? 0),
            expenses: Number(payload?.data?.expenses ?? 0),
            balance: Number(payload?.data?.balance ?? 0)
          });
        }
      } catch (error) {
        if (active) {
          setSnapshot(null);
        }
        // Keep the landing page usable even if the snapshot cannot be loaded.
        console.error('Homepage snapshot load failed', error);
      }
    })();

    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between gap-12 px-6 py-8 lg:px-10">
          <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <div>
              <p className="font-display text-2xl tracking-wide text-gold">Finora</p>
              <p className="text-sm text-white/60">Finance + Aura</p>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="hidden text-sm text-white/75 sm:inline">{session?.user?.name ?? session?.user?.email}</span>
                  <Button asChild className="bg-gold text-black hover:bg-gold-light">
                    <QuickLink href="/dashboard">Go to dashboard</QuickLink>
                  </Button>
                  <Button variant="outline" onClick={() => signOut({ callbackUrl: '/login' })}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="bg-gold text-black hover:bg-gold-light">
                    <Link href="/register">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </header>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold-light">
                <Sparkles className="h-4 w-4" />
                Professional financial management for modern teams
              </span>
              <h1 className="mt-6 font-display text-5xl leading-none tracking-tight text-white md:text-7xl">
                Intelligent finance, presented with absolute clarity.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
                Track income, expenses, assets, liabilities, and reports in one polished workspace built for speed, reliability, and a premium user experience.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="bg-gold text-black hover:bg-gold-light">
                  <QuickLink href="/dashboard">
                    Open dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </QuickLink>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  <Link href="/dashboard/reports">Explore reports</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="glass-panel rounded-[28px] p-5"
            >
              <FinancialCard
                title="Net balance"
                amount={snapshot?.balance ?? 0}
                trend={isLoggedIn && snapshot ? 'Live' : undefined}
                trendLabel={isLoggedIn ? 'vs last month' : 'Sign in to load live data'}
                tone="positive"
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FinancialCard title="Income" amount={snapshot?.income ?? 0} tone="positive" compact />
                <FinancialCard title="Expense" amount={snapshot?.expenses ?? 0} tone="negative" compact />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 pb-6 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
                className="glass-panel rounded-2xl p-5"
              >
                <item.icon className="h-5 w-5 text-gold-light" />
                <h2 className="mt-4 text-lg font-semibold text-white">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}