'use client';

import Link from 'next/link';
import QuickLink from '@/components/ui/quick-link';
import dynamic from 'next/dynamic';
const ArrowRight = dynamic(() => import('lucide-react').then((m) => m.ArrowRight), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then((m) => m.ShieldCheck), { ssr: false });
const Sparkles = dynamic(() => import('lucide-react').then((m) => m.Sparkles), { ssr: false });
const LineChart = dynamic(() => import('lucide-react').then((m) => m.LineChart), { ssr: false });
const WalletCards = dynamic(() => import('lucide-react').then((m) => m.WalletCards), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then((m) => m.TrendingUp), { ssr: false });
const TriangleAlert = dynamic(() => import('lucide-react').then((m) => m.TriangleAlert), { ssr: false });
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
          <header className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="min-w-0">
              <p className="font-display text-xl tracking-wide text-gold sm:text-2xl">Finora</p>
              <p className="text-xs text-white/60 sm:text-sm">Finance + Aura</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {isLoggedIn ? (
                <>
                  <span className="hidden text-sm text-white/75 md:inline">{session?.user?.name ?? session?.user?.email}</span>
                  <Button asChild size="sm" className="bg-gold text-black hover:bg-gold-light">
                    <QuickLink href="/dashboard">Dashboard</QuickLink>
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

          <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[1.08fr_0.92fr] xl:gap-6">
            <div className="flex min-h-0 flex-col gap-5">
              <div className="rounded-[34px] border border-white/10 bg-white/4 p-6 sm:p-8 xl:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-light sm:text-sm">
                  <Sparkles className="h-4 w-4" />
                  Professional financial management for modern teams
                </span>

                <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.8rem,5.2vw,5.1rem)] leading-[0.92] tracking-tight text-white">
                  Intelligent finance,
                  <br />
                  presented with
                  <br />
                  absolute clarity.
                </h1>

                <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/75 sm:text-lg">
                  Track income, expenses, assets, liabilities, and reports in one polished workspace built for speed, reliability, and a premium user experience.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button asChild size="sm" className="h-11 rounded-full bg-gold px-5 text-black hover:bg-gold-light">
                    <QuickLink href="/dashboard">
                      Open dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </QuickLink>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="h-11 rounded-full border-white/15 bg-white/5 px-5 text-white hover:bg-white/10">
                    <Link href="/dashboard/reports">Explore reports</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-[34px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
              <div className="rounded-[26px] border border-white/10 bg-[#171b25] p-5 sm:p-6">
                <div className="text-sm text-white/55">Net balance</div>
                <div className="mt-2 font-mono text-[clamp(2.2rem,4vw,3.4rem)] font-semibold tracking-tight text-white">
                  <AmountDynamic value={overview?.summary.balance ?? 0} baseRem={1.15} />
                </div>
                <p className="mt-2 text-sm text-white/50">{isLoggedIn && overview ? 'Live data from the database' : 'Sign in to load live data'}</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-[#171b25] p-4">
                  <p className="text-sm text-white/55">Income</p>
                  <div className="mt-2 font-mono text-2xl tracking-tight text-white">
                    <AmountDynamic value={overview?.summary.income ?? 0} baseRem={1.05} />
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-[#171b25] p-4">
                  <p className="text-sm text-white/55">Expense</p>
                  <div className="mt-2 font-mono text-2xl tracking-tight text-white">
                    <AmountDynamic value={overview?.summary.expenses ?? 0} baseRem={1.05} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-[#171b25] p-4">
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <TrendingUp className="h-4 w-4 text-gold-light" />
                    Assets total
                  </div>
                  <div className="mt-2 font-mono text-2xl tracking-tight text-white">
                    <AmountDynamic value={overview?.balanceSheet.assets ?? 0} baseRem={1.05} />
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-[#171b25] p-4">
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <TriangleAlert className="h-4 w-4 text-gold-light" />
                    Liabilities total
                  </div>
                  <div className="mt-2 font-mono text-2xl tracking-tight text-white">
                    <AmountDynamic value={overview?.balanceSheet.liabilities ?? 0} baseRem={1.05} />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-light/80">Live database snapshot</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-white/10 bg-[#171b25] p-4">
                    <div className="flex items-center gap-2 text-sm text-white/55">
                      <TrendingUp className="h-4 w-4 text-gold-light" />
                      Assets total
                    </div>
                    <div className="mt-2 font-mono text-2xl tracking-tight text-white">
                      <AmountDynamic value={overview?.balanceSheet.assets ?? 0} baseRem={1.05} />
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-[#171b25] p-4">
                    <div className="flex items-center gap-2 text-sm text-white/55">
                      <TriangleAlert className="h-4 w-4 text-gold-light" />
                      Liabilities total
                    </div>
                    <div className="mt-2 font-mono text-2xl tracking-tight text-white">
                      <AmountDynamic value={overview?.balanceSheet.liabilities ?? 0} baseRem={1.05} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="h-full rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                <item.icon className="h-4 w-4 text-gold-light" />
                <h2 className="mt-4 text-base font-semibold text-white">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}