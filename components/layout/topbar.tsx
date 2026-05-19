'use client';

import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Topbar() {
  const { data: session } = useSession();
  const [organizationName, setOrganizationName] = useState('Current organization');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch('/api/organizations');
        if (!response.ok) {
          return;
        }

        const payload = (await response.json().catch(() => null)) as { data?: Array<{ name?: string }>; error?: string } | null;
        const firstOrganization = payload?.data?.[0]?.name;

        if (active && firstOrganization) {
          setOrganizationName(firstOrganization);
        }
      } catch (error) {
        // If the workspace cannot be loaded, keep the fallback label so the topbar remains stable.
        console.error('Failed to load organizations', error);
      }
    })();

    return () => {
      active = false;
    };
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            {organizationName}
            <ChevronDown className="h-4 w-4 text-white/45" />
          </div>
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