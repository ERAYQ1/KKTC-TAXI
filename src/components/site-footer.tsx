export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} KKTC Taksi. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
