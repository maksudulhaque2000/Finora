'use client';

import Link from 'next/link';
import QuickLink from '@/components/ui/quick-link';
import dynamic from 'next/dynamic';
const ArrowRight = dynamic(() => import('lucide-react').then((m) => m.ArrowRight), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then((m) => m.ShieldCheck), { ssr: false });
const Sparkles = dynamic(() => import('lucide-react').then((m) => m.Sparkles), { ssr: false });
const LineChart = dynamic(() => import('lucide-react').then((m) => m.LineChart), { ssr: false });
const WalletCards = dynamic(() => import('lucide-react').then((m) => m.WalletCards), { ssr: false });
// removed framer-motion to reduce client bundle size
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';
import AmountDynamic from '@/components/amount-dynamic';

const highlights = [
  { label: 'Secure accounting', icon: ShieldCheck, description: 'Protected workflows and audit-friendly data structure.' },
  { label: 'Real-time insight', icon: LineChart, description: 'Summary cards and ledger views tuned for clarity.' },
  { label: 'Premium interface', icon: Sparkles, description: 'Dark luxury design with concise motion.' },
  { label: 'Multi-entity ready', icon: WalletCards, description: 'Built for households, NGOs, and teams.' }
];

type OverviewState = {
  summary: { income: number; expenses: number; balance: number };
  balanceSheet: { assets: number; liabilities: number };
  assets: Array<{ id: string; name: string; type: string; value: number }>;
  liabilities: Array<{ id: string; name: string; type: string; balance: number }>;
};

export default function HomePage() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const [overview, setOverview] = useState<OverviewState | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setOverview(null);
      return;
    }

    let active = true;

    (async () => {
      try {
        const response = await fetch('/api/reports/home');
        const payload = (await response.json().catch(() => null)) as { data?: OverviewState; error?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Failed to load financial overview.');
        }

        if (active && payload?.data) {
          setOverview({
            summary: {
              income: Number(payload.data.summary?.income ?? 0),
              expenses: Number(payload.data.summary?.expenses ?? 0),
              balance: Number(payload.data.summary?.balance ?? 0)
            },
            balanceSheet: {
              assets: Number(payload.data.balanceSheet?.assets ?? 0),
              liabilities: Number(payload.data.balanceSheet?.liabilities ?? 0)
            },
            assets: Array.isArray(payload.data.assets)
              ? payload.data.assets.slice(0, 3).map((asset) => ({
                  id: asset.id,
                  name: asset.name,
                  type: asset.type,
                  value: Number(asset.value)
                }))
              : [],
            liabilities: Array.isArray(payload.data.liabilities)
              ? payload.data.liabilities.slice(0, 3).map((liability) => ({
                  id: liability.id,
                  name: liability.name,
                  type: liability.type,
                  balance: Number(liability.balance)
                }))
              : []
          });
        }
      } catch (error) {
        if (active) {
          setOverview(null);
        }

        console.error('Homepage overview load failed', error);
      }
    })();

    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  return (
    <main className="h-screen overflow-hidden text-white">
      <section className="relative isolate h-full">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
          <header className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-display text-xl tracking-wide text-gold sm:text-2xl">Finora</p>
              <p className="text-xs text-white/60 sm:text-sm">Finance + Aura</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {isLoggedIn ? (
                <>
                  <span className="hidden text-sm text-white/75 md:inline">{session?.user?.name ?? session?.user?.email}</span>
                  <Button asChild size="sm" className="bg-gold text-black hover:bg-gold-light">
                    <QuickLink href="/dashboard">Go to dashboard</QuickLink>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => signOut({ redirectTo: '/login' })}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gold text-black hover:bg-gold-light">
                    <Link href="/register">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </header>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6">
            <div className="flex min-h-0 flex-col gap-4">
              <div className="glass-panel rounded-[28px] p-5 xl:p-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold-light sm:text-sm">
                  <Sparkles className="h-4 w-4" />
                  Professional financial management for modern teams
                </span>

                <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.65rem,5vw,4.7rem)] leading-[0.95] tracking-tight text-white">
                  Intelligent finance, presented with absolute clarity.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72 sm:text-base lg:text-lg">
                  Track income, expenses, assets, liabilities, and reports in one polished workspace built for speed, reliability, and a premium user experience.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button asChild size="sm" className="bg-gold text-black hover:bg-gold-light sm:h-11 sm:px-5">
                    <QuickLink href="/dashboard">
                      Open dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </QuickLink>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 sm:h-11 sm:px-5">
                    <Link href="/dashboard/reports">Explore reports</Link>
                  </Button>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {highlights.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-xl">
                      <item.icon className="h-4 w-4 text-gold-light" />
                      <h2 className="mt-2 text-sm font-semibold text-white">{item.label}</h2>
                      <p className="mt-1 text-xs leading-5 text-white/60">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assets & Liabilities small preview cards removed per user request */}
            </div>

            <div className="glass-panel flex min-h-0 flex-col rounded-[28px] p-4 xl:p-5">
              <FinancialCard
                title="Net balance"
                amount={overview?.summary.balance ?? 0}
                trend={isLoggedIn && overview ? 'Live' : undefined}
                trendLabel={isLoggedIn ? 'vs last month' : 'Sign in to load live data'}
                tone="positive"
              />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FinancialCard title="Income" amount={overview?.summary.income ?? 0} tone="positive" compact />
                <FinancialCard title="Expense" amount={overview?.summary.expenses ?? 0} tone="negative" compact />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Assets total</p>
                  <div className="mt-3 text-lg font-semibold text-white">
                    <AmountDynamic value={overview?.balanceSheet.assets ?? 0} baseRem={1.25} />
                  </div>
                  <p className="mt-2 text-xs text-white/45">From live database records</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Liabilities total</p>
                  <div className="mt-3 text-lg font-semibold text-white">
                    <AmountDynamic value={overview?.balanceSheet.liabilities ?? 0} baseRem={1.25} />
                  </div>
                  <p className="mt-2 text-xs text-white/45">From live database records</p>
                </div>
              </div>

              <div className="mt-3 grid min-h-0 gap-3 xl:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-light/80">Quick note</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    The landing page is now compact by design so the most important values stay visible without scrolling.
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-light/80">Live data</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Assets and liabilities are pulled from the database and previewed alongside income and expense snapshot cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}