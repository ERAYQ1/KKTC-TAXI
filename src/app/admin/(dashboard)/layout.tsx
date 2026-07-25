import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/login/actions";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { setLang } from "@/app/actions";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authorisation gate for every nested admin page.
  const [user, lang] = await Promise.all([requireAdmin(), getLang()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <Link href="/admin" className="font-display text-lg font-bold">
            {t(lang, "adminPanelTitle")}
          </Link>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/yorumlar"
            className="inline-flex h-11 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
          >
            {t(lang, "adminNavReviews")}
          </Link>
          <Link
            href="/admin/gecmis"
            className="inline-flex h-11 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
          >
            {t(lang, "adminNavHistory")}
          </Link>
          <Link
            href="/admin/taksiler/yeni"
            className="inline-flex h-11 items-center rounded-lg bg-brand-strong px-4 text-sm font-semibold text-white transition-colors hover:brightness-110"
          >
            {t(lang, "adminNavNewTaxi")}
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
          <form action={logout}>
            <button
              type="submit"
              className="h-11 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-brand-soft"
            >
              {t(lang, "adminLogout")}
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
