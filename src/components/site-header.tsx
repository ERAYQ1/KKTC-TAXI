import Link from "next/link";
import { CarIcon } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-strong text-white">
            <CarIcon className="size-5" />
          </span>
          KKTC <span className="text-brand-strong">Taksi</span>
        </Link>
        <nav aria-label="Ana gezinme">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:text-brand-strong"
          >
            Taksiler
          </Link>
        </nav>
      </div>
    </header>
  );
}
