export function PageSkeleton() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="glass-panel rounded-[28px] p-6">
          <div className="h-4 w-32 rounded-full skeleton-shimmer animate-shimmer" />
          <div className="mt-5 h-12 w-2/3 rounded-2xl skeleton-shimmer animate-shimmer" />
          <div className="mt-4 h-4 w-1/2 rounded-full skeleton-shimmer animate-shimmer" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-panel rounded-[24px] p-5">
              <div className="h-4 w-24 rounded-full skeleton-shimmer animate-shimmer" />
              <div className="mt-4 h-10 w-28 rounded-xl skeleton-shimmer animate-shimmer" />
              <div className="mt-3 h-3 w-20 rounded-full skeleton-shimmer animate-shimmer" />
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-[28px] p-6">
          <div className="mb-4 h-6 w-40 rounded-full skeleton-shimmer animate-shimmer" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-14 rounded-2xl skeleton-shimmer animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}