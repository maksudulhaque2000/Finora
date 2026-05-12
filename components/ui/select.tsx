import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'flex h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/40',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}