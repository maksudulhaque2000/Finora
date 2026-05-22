'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TitleManager from '@/components/title-manager';

type SearchTarget = {
  label: string;
  description: string;
  href: string;
  keywords: string[];
  searchParam?: boolean;
};

const SEARCH_TARGETS: SearchTarget[] = [
  {
    label: 'Transaction overview',
    description: 'Open the dashboard and search transactions by description, note, or category.',
    href: '/dashboard',
    keywords: ['transaction', 'transactions', 'transcation', 'search', 'overview'],
    searchParam: true
  },
  {
    label: 'Expense entries',
    description: 'Jump to expense records and search the expense ledger.',
    href: '/dashboard/expenses',
    keywords: ['expense', 'spend', 'bill', 'payment'],
    searchParam: true
  },
  {
    label: 'Income entries',
    description: 'Jump to income records and search earnings by text.',
    href: '/dashboard/income',
    keywords: ['income', 'revenue', 'earnings', 'salary'],
    searchParam: true
  },
  {
    label: 'Categories',
    description: 'Review category groups and filter by category name or type.',
    href: '/dashboard/categories',
    keywords: ['category', 'categories', 'tag', 'group'],
    searchParam: true
  },
  {
    label: 'Reports',
    description: 'Open reporting tools, range controls, and PDF exports.',
    href: '/dashboard/reports',
    keywords: ['report', 'reports', 'ledger', 'summary', 'export']
  }
];

function buildSearchHref(target: SearchTarget, query: string) {
  if (!target.searchParam) {
    return target.href;
  }

  const params = new URLSearchParams();
  params.set('search', query);
  return `${target.href}?${params.toString()}`;
}

export function Topbar() {
  const { data: session } = useSession();
  const [organizationName, setOrganizationName] = useState('Current organization');
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return SEARCH_TARGETS;
    }

    return SEARCH_TARGETS.filter((target) => {
      const haystack = `${target.label} ${target.description} ${target.keywords.join(' ')}`.toLowerCase();
      return haystack.includes(normalizedQuery) || target.keywords.some((keyword) => keyword.includes(normalizedQuery));
    });
  }, [query]);

  function navigateTo(href: string) {
    window.dispatchEvent(new CustomEvent('quick:navigate', { detail: href }));
    setQuery('');
    setIsSearchOpen(false);
  }

  function resolveHref(input: string) {
    const normalizedInput = input.trim().toLowerCase();

    if (!normalizedInput) {
      return '';
    }

    const matchedTarget =
      SEARCH_TARGETS.find((target) => target.keywords.some((keyword) => normalizedInput.includes(keyword))) ?? SEARCH_TARGETS[0];

    return buildSearchHref(matchedTarget, input.trim());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    navigateTo(resolveHref(trimmedQuery));
  }

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

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchPanelRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <TitleManager />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div ref={searchPanelRef} className="relative lg:flex-1 lg:max-w-2xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70 transition focus-within:border-gold/40 focus-within:bg-white/8">
            <Search className="h-4 w-4 shrink-0 text-white/35" />
            <Input
              className="h-auto border-0 bg-transparent px-0 text-sm ring-0 focus:ring-0"
              placeholder="Search transactions, reports, categories..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
            />
          </form>

          {isSearchOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1220]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/45">Quick search</div>
              <div className="max-h-80 overflow-y-auto p-2">
                {suggestions.length > 0 ? (
                  suggestions.map((target) => {
                    const href = buildSearchHref(target, query.trim() || target.label);

                    return (
                      <button
                        key={target.label}
                        type="button"
                        className="flex w-full items-start justify-between gap-4 rounded-2xl px-4 py-3 text-left text-white/85 transition hover:bg-white/8"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => navigateTo(href)}
                      >
                        <span className="min-w-0">
                          <span className="block font-medium text-white">{target.label}</span>
                          <span className="mt-1 block text-sm leading-5 text-white/52">{target.description}</span>
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/45">Open</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-10 text-center text-sm text-white/52">No direct match. Press Enter to search transactions.</div>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {session?.user ? (
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80">
              {session.user.name ?? session.user.email}
            </div>
          ) : null}
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            {organizationName}
          </div>
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