'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import LoadingProvider from '@/components/loading';
import QuickNavigator from '@/components/quick-navigator';
import ToastProvider from '@/components/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LoadingProvider>
          <ToastProvider>
            <QuickNavigator />
            {children}
          </ToastProvider>
        </LoadingProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}