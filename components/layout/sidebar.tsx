'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Menu } from 'lucide-react';
import { navigationItems } from '@/components/layout/navigation';
import { useUiStore } from '@/store/ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-black/25 backdrop-blur-xl lg:flex lg:flex-col', sidebarOpen ? 'w-72' : 'w-20')}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
        {sidebarOpen ? (
          <div>
            <p className="font-display text-2xl text-gold">Finora</p>
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">Finance + Aura</p>
          </div>
        ) : (
          <div className="font-display text-2xl text-gold">F</div>
        )}
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-5">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                active ? 'bg-gold text-black shadow-glow' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {sidebarOpen ? <span className="font-medium">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-white/45">
        {sidebarOpen ? 'Protected workspace with optimized loading, data validation, and graceful error handling.' : null}
      </div>
    </aside>
  );
}