"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold">Bir şeyler ters gitti</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Taksiler yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar
        deneyin.
      </p>
      <button
        onClick={reset}
        className="mt-6 h-12 rounded-lg bg-brand-strong px-6 font-semibold text-white transition-colors hover:brightness-110"
      >
        Tekrar dene
      </button>
    </div>
  );
}
