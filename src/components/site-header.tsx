import Link from "next/link";
import { CarIcon } from "@/components/icons";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { setLang } from "@/app/actions";

export async function SiteHeader() {
  const lang = await getLang();

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
        <nav
          aria-label="Ana gezinme"
          className="flex items-center gap-1 sm:gap-2"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:text-brand-strong"
          >
            {t(lang, "navTaxis")}
          </Link>
          <Link
            href="/favoriler"
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:text-brand-strong"
          >
            {t(lang, "navFavorites")}
          </Link>
          <form action={setLang}>
            <input type="hidden" name="lang" value={lang === "tr" ? "en" : "tr"} />
            <button
              type="submit"
              aria-label={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
              className="inline-flex h-11 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:border-brand-strong hover:text-brand-strong"
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
