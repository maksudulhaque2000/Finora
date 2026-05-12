'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DateRangePicker({
  from,
  to,
  onChange
}: {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
}) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 md:grid-cols-2">
      <div>
        <Label htmlFor="from">From</Label>
        <Input id="from" type="date" value={from ?? ''} onChange={(event) => onChange({ from: event.target.value, to })} />
      </div>
      <div>
        <Label htmlFor="to">To</Label>
        <Input id="to" type="date" value={to ?? ''} onChange={(event) => onChange({ from, to: event.target.value })} />
      </div>
    </div>
  );
}