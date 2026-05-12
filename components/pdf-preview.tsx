export function PDFPreview({ title = 'PDF Preview' }: { title?: string }) {
  return (
    <div className="glass-panel rounded-[28px] p-6">
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/65">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-light">{title}</p>
        <div className="mt-4 h-80 rounded-2xl bg-gradient-to-b from-white/8 to-white/3" />
      </div>
    </div>
  );
}