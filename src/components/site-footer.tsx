import { SITE_NAME } from "@/lib/site";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export async function SiteFooter() {
  const lang = await getLang();

  return (
    <footer className="mt-8 border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. {t(lang, "footerRights")}
        </p>
        <p className="mt-1">{t(lang, "footerPriceNote")}</p>
      </div>
    </footer>
  );
}
