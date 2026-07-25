export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="sr-only" role="status">
        Taksiler yükleniyor
      </div>
      <div className="h-10 w-3/4 animate-pulse rounded-lg bg-brand-soft sm:h-14" />
      <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-brand-soft" />
      <div className="mt-8 h-12 animate-pulse rounded-lg bg-brand-soft" />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <div className="aspect-16/10 animate-pulse bg-brand-soft" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-brand-soft" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-brand-soft" />
              <div className="h-11 animate-pulse rounded-lg bg-brand-soft" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
