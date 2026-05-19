'use client';

import { useState, useTransition } from 'react';
import { FileText, Download } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { PDFPreview } from '@/components/pdf-preview';

const reportCards = [
  { title: 'Income statement', description: 'Income minus expense for the selected date range.' },
  { title: 'Balance sheet', description: 'Assets versus liabilities with equity snapshot.' },
  { title: 'Cash flow', description: 'Movement of money in and out over time.' },
  { title: 'Monthly ledger', description: 'Running balance with detailed day-by-day entries.' }
];

export default function ReportsPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function exportPdf() {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch('/api/reports/export-pdf', { method: 'POST' });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? 'PDF export failed.');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'finora-report.pdf';
        anchor.click();
        window.URL.revokeObjectURL(url);
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
          <h3 className="text-lg font-semibold text-white">Export checklist</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li>Cover page with organization details</li>
            <li>Financial summary table</li>
            <li>Detailed transaction table with debit, credit, and balance</li>
            <li>Category subtotals and closing balance</li>
            <li>Page numbers and A4 formatting</li>
          </ul>
        </div>
        <PDFPreview title="Pre-export preview" />
      </div>
    </PageShell>
  );
}