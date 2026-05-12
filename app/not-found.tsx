import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel max-w-xl rounded-[28px] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-gold-light">404</p>
        <h1 className="mt-4 font-display text-4xl text-white">Page not found</h1>
        <p className="mt-3 text-white/65">The page you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-6 bg-gold text-black hover:bg-gold-light">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}