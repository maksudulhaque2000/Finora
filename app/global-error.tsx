'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="glass-panel max-w-xl rounded-[28px] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-crimson">Application error</p>
            <h1 className="mt-4 font-display text-4xl text-white">Finora hit a critical error</h1>
            <p className="mt-3 text-white/65">{error.message || 'Please reload the application and try again.'}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={reset} className="bg-gold text-black hover:bg-gold-light">
                Reload app
              </Button>
              <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}