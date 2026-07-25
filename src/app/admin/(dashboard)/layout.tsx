import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/login/actions";

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
  const user = await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <Link href="/admin" className="font-display text-lg font-bold">
            Yönetim Paneli
          </Link>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/taksiler/yeni"
            className="inline-flex h-11 items-center rounded-lg bg-brand-strong px-4 text-sm font-semibold text-white transition-colors hover:brightness-110"
          >
            Yeni taksi
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="h-11 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-brand-soft"
            >
              Çıkış
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
