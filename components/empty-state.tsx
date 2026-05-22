"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  actionHref
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-[28px] px-6 py-12 text-center">
      <div className="rounded-full border border-white/10 bg-white/5 p-4 text-gold">
        {icon ? icon : null}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">{description}</p>
      {actionLabel ? (
        onAction ? (
          <Button onClick={onAction} className="mt-6 bg-gold text-black hover:bg-gold-light">
            {actionLabel}
          </Button>
        ) : actionHref ? (
          <Button asChild className="mt-6 bg-gold text-black hover:bg-gold-light">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null
      ) : null}
    </div>
  );
}