'use client';

import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Topbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70 lg:flex-1 lg:max-w-2xl">
          <Search className="h-4 w-4 shrink-0 text-white/35" />
          <Input className="h-auto border-0 bg-transparent px-0 text-sm ring-0 focus:ring-0" placeholder="Search transactions, reports, categories..." />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {session?.user ? (
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80">
              {session.user.name ?? session.user.email}
            </div>
          ) : null}
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={() => {
              // toggle both next-themes and a html.light class for our simple fallback
              const next = theme === 'dark' ? 'light' : 'dark';
              setTheme(next);
              try {
                if (typeof document !== 'undefined') {
                  document.documentElement.classList.toggle('light', next === 'light');
                }
              } catch {
                // noop
              }
            }}
          >
            {mounted ? (theme === 'dark' ? 'Dark' : 'Light') + ' mode' : 'Theme'}
          </Button>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Current organization
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </Button>
          {session?.user ? (
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => signOut({ callbackUrl: '/login' })}>
              Sign out
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}