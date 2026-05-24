import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = 'text', ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full min-w-0 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 shadow-sm outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/40',
          className
        )}
        {...props}
      />
    );
  }
);