'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import LoadingProvider from '@/components/loading';
import QuickNavigator from '@/components/quick-navigator';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LoadingProvider>
          <QuickNavigator />
          {children}
        </LoadingProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}