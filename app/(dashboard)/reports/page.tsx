'use client';

import { useMemo, useState, useTransition } from 'react';
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { CalendarRange, Download, FileText } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { PDFPreview } from '@/components/pdf-preview';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const reportCards = [
  { title: 'Income statement', description: 'Income minus expense for the selected date range.' },
  { title: 'Balance sheet', description: 'Assets versus liabilities with equity snapshot.' },
  { title: 'Cash flow', description: 'Movement of money in and out over time.' },
  { title: 'Monthly ledger', description: 'Running balance with detailed day-by-day entries.' }
];

type ReportPreset = '1m' | '3m' | '6m' | '1y' | '2y' | '5y' | 'all';

function buildRange(preset: ReportPreset) {
  const today = new Date();

  switch (preset) {
    case '1m':
      return { from: startOfMonth(subMonths(today, 0)), to: endOfMonth(today) };
    case '3m':
      return { from: startOfMonth(subMonths(today, 2)), to: endOfMonth(today) };
    case '6m':
      return { from: startOfMonth(subMonths(today, 5)), to: endOfMonth(today) };
    case '1y':
      return { from: startOfYear(subYears(today, 0)), to: endOfYear(today) };
    case '2y':
      return { from: startOfYear(subYears(today, 1)), to: endOfYear(today) };
    case '5y':
      return { from: startOfYear(subYears(today, 4)), to: endOfYear(today) };
    case 'all':
    default:
      return { from: undefined, to: undefined };
  }
}

export default function ReportsPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preset, setPreset] = useState<ReportPreset>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const rangeLabel = useMemo(() => {
    if (fromDate || toDate) {
      return `${fromDate || 'Start'} → ${toDate || 'Present'}`;
    }

    switch (preset) {
      case '1m':
        return 'Last 1 month';
      case '3m':
        return 'Last 3 months';
      case '6m':
        return 'Last 6 months';
      case '1y':
        return 'Last 1 year';
      case '2y':
        return 'Last 2 years';
      case '5y':
        return 'Last 5 years';
      default:
        return 'All time';
    }
  }, [fromDate, preset, toDate]);

  function exportPdf() {
    startTransition(async () => {
      setError(null);

      try {
        const url = new URL('/api/reports/export-pdf', window.location.origin);
        const presetRange = buildRange(preset);

        if (fromDate) {
          url.searchParams.set('from', fromDate);
        } else if (presetRange.from) {
          url.searchParams.set('from', format(presetRange.from, 'yyyy-MM-dd'));
        }

        if (toDate) {
          url.searchParams.set('to', toDate);
        } else if (presetRange.to) {
          url.searchParams.set('to', format(presetRange.to, 'yyyy-MM-dd'));
        }

        const response = await fetch(url.toString(), { method: 'POST' });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? 'PDF export failed.');
        }

        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = 'finora-report.pdf';
        anchor.click();
        window.URL.revokeObjectURL(objectUrl);
      } catch (exportError) {
        const message = exportError instanceof Error ? exportError.message : 'PDF export failed.';
        setError(message);
        // eslint-disable-next-line no-console
        console.error('PDF export failed', exportError);
      }
    });
  }

  return (
    <PageShell
      title="Reports"
      description="Generate finance reports with running balance, category breakdowns, and professional PDF export flows."
      actions={
        <Button className="bg-gold text-black hover:bg-gold-light" onClick={exportPdf} disabled={isPending}>
          <Download className="h-4 w-4" />
          {isPending ? 'Exporting...' : 'Export PDF'}
        </Button>
      }
    >
      {error ? <p className="rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((report) => (
          <div key={report.title} className="glass-panel rounded-[24px] p-5">
            <FileText className="h-5 w-5 text-gold-light" />
            <h3 className="mt-4 text-lg font-semibold text-white">{report.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{report.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center gap-2 text-gold-light">
            <CalendarRange className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-white">Export range</h3>
          </div>
          <p className="mt-2 text-sm text-white/60">Choose a preset or set custom dates before exporting.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {([
              ['all', 'All time'],
              ['1m', '1 month'],
              ['3m', '3 months'],
              ['6m', '6 months'],
              ['1y', '1 year'],
              ['2y', '2 years'],
              ['5y', '5 years']
            ] as Array<[ReportPreset, string]>).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={preset === value ? 'default' : 'outline'}
                className={preset === value ? 'bg-gold text-black hover:bg-gold-light' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}
                onClick={() => setPreset(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fromDate">From</Label>
              <Input id="fromDate" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="toDate">To</Label>
              <Input id="toDate" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </div>
          </div>
          <p className="mt-4 text-sm text-white/50">Selected range: {rangeLabel}</p>
        </div>
        <PDFPreview title="Pre-export preview" />
      </div>
    </PageShell>
  );
}