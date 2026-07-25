import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-foreground">
          KKTC <span className="text-primary">Taksi</span>
        </Link>
        <nav aria-label="Ana gezinme">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Taksiler
          </Link>
        </nav>
      </div>
    </header>
  );
}
