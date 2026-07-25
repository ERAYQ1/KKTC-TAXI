import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
        </p>
        <p className="mt-1">
          Taksi ücretleri şoför tarafından belirlenir; bilgiler değişebilir.
        </p>
      </div>
    </footer>
  );
}
