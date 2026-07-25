import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="font-display text-5xl font-bold text-brand">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Aradığınız taksi kaydı kaldırılmış veya bağlantı hatalı olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-strong px-6 font-semibold text-white transition-colors hover:brightness-110"
      >
        Taksileri gör
      </Link>
    </div>
  );
}
