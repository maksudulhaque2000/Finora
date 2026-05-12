import { cn } from '@/lib/utils';

export function PageShell({
  title,
  description,
  actions,
  children,
  className
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8', className)}>
      <div className="flex flex-col gap-4 rounded-[28px] glass-panel p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold-light/85">Finora workspace</p>
          <h1 className="mt-2 font-display text-4xl text-white">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}