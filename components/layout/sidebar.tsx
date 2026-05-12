'use client';

import { usePathname } from 'next/navigation';
import { ChevronLeft, Menu } from 'lucide-react';
import { navigationItems } from '@/components/layout/navigation';
import { useUiStore } from '@/store/ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import QuickLink from '@/components/ui/quick-link';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-black/25 backdrop-blur-xl lg:flex lg:flex-col',
        sidebarOpen ? 'w-72' : 'w-20'
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-white/80" />
          {sidebarOpen ? <span className="font-display text-lg text-gold">Finora</span> : <span className="sr-only">Finora</span>}
        </div>
        <Button variant="ghost" onClick={toggleSidebar} className="rounded-full p-2">
          <ChevronLeft className={cn('h-4 w-4 transition', sidebarOpen ? 'rotate-0' : 'rotate-180')} />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          return (
            <QuickLink
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                active ? 'bg-gold text-black shadow-glow' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {sidebarOpen ? <span className="font-medium">{item.label}</span> : null}
            </QuickLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-white/45">
        {sidebarOpen ? 'Protected workspace with optimized loading, data validation, and graceful error handling.' : null}
      </div>
    </aside>
  );
}