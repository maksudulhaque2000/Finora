"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'default', asChild, children, type = 'button', ...props },
  ref
) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:pointer-events-none disabled:opacity-60';
  const variants = {
    default: 'bg-gold text-black hover:translate-y-[-1px] hover:bg-gold-light',
    outline: 'border border-white/15 bg-white/10 text-white hover:bg-white/15',
    ghost: 'text-white hover:bg-white/10'
  } satisfies Record<NonNullable<ButtonProps['variant']>, string>;
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    default: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base'
  } satisfies Record<NonNullable<ButtonProps['size']>, string>;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(classes, (children.props as { className?: string }).className)
    });
  }

  return (
    <button ref={ref} type={type} className={classes} {...props}>
      {children}
    </button>
  );
});