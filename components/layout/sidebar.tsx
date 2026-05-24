'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { navigationItems } from '@/components/layout/navigation';
import { useUiStore } from '@/store/ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import QuickLink from '@/components/ui/quick-link';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, mobileSidebarOpen, toggleSidebar, closeMobileSidebar } = useUiStore();

  useEffect(() => {
    closeMobileSidebar();
  }, [closeMobileSidebar, pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobileSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMobileSidebar]);

  return (
    <>
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-black/25 backdrop-blur-xl transition-[width] duration-200 lg:flex lg:flex-col',
          sidebarOpen ? 'w-72' : 'w-20'
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <Menu className="h-5 w-5 text-white/80" />
            {sidebarOpen ? <span className="font-display text-lg text-gold">Finora</span> : <span className="sr-only">Finora</span>}
          </div>
          <Button variant="ghost" onClick={toggleSidebar} className="rounded-full p-2" aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
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
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen ? <span className="min-w-0 font-medium">{item.label}</span> : null}
              </QuickLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs text-white/45">
          {sidebarOpen ? 'Protected workspace with optimized loading, data validation, and graceful error handling.' : null}
        </div>
      </aside>

      <div className={cn('fixed inset-0 z-50 lg:hidden', mobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!mobileSidebarOpen}>
        <button
          type="button"
          aria-label="Close navigation"
          className={cn('absolute inset-0 bg-black/60 transition-opacity duration-200', mobileSidebarOpen ? 'opacity-100' : 'opacity-0')}
          onClick={closeMobileSidebar}
        />
        <aside
          className={cn(
            'relative flex h-full w-[min(18rem,85vw)] flex-col border-r border-white/10 bg-black/90 backdrop-blur-xl transition-transform duration-200',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <Menu className="h-5 w-5 text-white/80" />
              <span className="font-display text-lg text-gold">Finora</span>
            </div>
            <Button variant="ghost" onClick={closeMobileSidebar} className="rounded-full p-2" aria-label="Close navigation">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4">
            {navigationItems.map((item) => {
              const active = pathname === item.href;
              return (
                <QuickLink
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                    active ? 'bg-gold text-black shadow-glow' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 font-medium">{item.label}</span>
                </QuickLink>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4 text-xs text-white/45">Protected workspace with optimized loading, data validation, and graceful error handling.</div>
        </aside>
      </div>
    </>
  );
}