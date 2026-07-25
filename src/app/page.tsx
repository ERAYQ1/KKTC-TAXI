export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          KKTC&apos;de taksiye{" "}
          <span className="text-primary">tek dokunuşla</span> ulaşın
        </h1>
        <p className="mt-4 text-lg text-foreground/70">
          Lefkoşa, Girne, Gazimağusa ve daha fazlasında güvenilir taksileri
          arayın veya WhatsApp&apos;tan yazın.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-10 text-center">
        <p className="text-foreground/60">
          Taksi listesi yakında burada görünecek.
        </p>
      </div>
    </div>
  );
}
