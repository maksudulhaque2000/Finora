'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TITLE_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard — Finora',
  '/dashboard/assets': 'Assets — Finora',
  '/dashboard/assets/new': 'New asset — Finora',
  '/dashboard/categories': 'Categories — Finora',
  '/dashboard/categories/new': 'New category — Finora',
  '/dashboard/expenses': 'Expenses — Finora',
  '/dashboard/income': 'Income — Finora',
  '/dashboard/liabilities': 'Liabilities — Finora',
  '/dashboard/liabilities/new': 'New liability — Finora',
  '/dashboard/reports': 'Reports — Finora',
  '/dashboard/settings': 'Settings — Finora'
};

function resolveTitle(pathname: string) {
  if (!pathname) return 'Finora';

  // exact match first
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];

  // try startsWith matches for nested routes
  const keys = Object.keys(TITLE_MAP);
  for (const key of keys) {
    if (pathname.startsWith(key)) return TITLE_MAP[key];
  }

  return 'Finora';
}

export default function TitleManager() {
  const pathname = usePathname();
  const title = resolveTitle(pathname ?? '');

  useEffect(() => {
    try {
      document.title = title;
      const og = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      if (og) og.content = title;
    } catch {
      // ignore in non-browser contexts
    }
  }, [title]);

  return null;
}
