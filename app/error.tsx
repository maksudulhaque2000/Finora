'use client';

// Link removed; using quick navigate anchor
import { Button } from '@/components/ui/button';
import QuickLink from '@/components/ui/quick-link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel max-w-xl rounded-[28px] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-crimson">Something went wrong</p>
        <h1 className="mt-4 font-display text-4xl text-white">We could not load this page</h1>
        <p className="mt-3 text-white/65">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="bg-gold text-black hover:bg-gold-light">
            Try again
          </Button>
          <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
            <QuickLink href="/dashboard">Go to dashboard</QuickLink>
          </Button>
        </div>
      </div>
    </main>
  );
}