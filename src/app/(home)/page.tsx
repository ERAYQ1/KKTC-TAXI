import type { Metadata } from "next";
import Link from "next/link";
import { TaxiCard } from "@/components/taxi-card";
import { TaxiFilters } from "@/components/taxi-filters";
import { CarIcon } from "@/components/icons";
import { getPublicTaxis } from "@/lib/queries";
import { isRegion, regionLabel } from "@/lib/taxi";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = {
  // `absolute` avoids the layout template appending the site name twice.
  title: { absolute: "KKTC Taksi | Kıbrıs'ta Hızlı Taksi Bulun" },
  description:
    "Lefkoşa, Girne, Gazimağusa, İskele, Güzelyurt ve Lefke'deki taksileri tek dokunuşla arayın veya WhatsApp'tan yazın.",
  alternates: { canonical: "/" },
};

type Props = {
  searchParams: Promise<{
    q?: string;
    region?: string;
    only?: string;
    page?: string;
  }>;
};

function pageHref(params: {
  q?: string;
  region?: string;
  only?: string;
  page: number;
}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.region) search.set("region", params.region);
  if (params.only) search.set("only", params.only);
  if (params.page > 1) search.set("page", String(params.page));
  const qs = search.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const region = isRegion(sp.region) ? sp.region : undefined;
  const only24_7 = sp.only === "1";
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const lang = await getLang();

  const { taxis, total, page, pageSize } = await getPublicTaxis({
    q,
    region,
    only24_7,
    page: requestedPage,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const heading = region
    ? `${regionLabel(region)} ${t(lang, "regionTaxisHeading")}`
    : t(lang, "allTaxisHeading");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="max-w-2xl">
        <h1 className="font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
          {t(lang, "heroTitlePrefix")}{" "}
          <span className="text-brand">{t(lang, "heroTitleHighlight")}</span>{" "}
          {t(lang, "heroTitleSuffix")}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {t(lang, "heroSubtitle")}
        </p>
      </section>

      <div className="mt-8">
        <TaxiFilters q={q} region={region} only24_7={only24_7} />
      </div>

      <section className="mt-8" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-semibold">{heading}</h2>
          <p className="text-sm text-muted-foreground">
            {total} {t(lang, "taxiCountSuffix")}
          </p>
        </div>

        {taxis.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-brand-soft px-6 py-14 text-center">
            <CarIcon className="mx-auto size-10 text-brand" />
            <p className="mt-4 font-display text-lg font-semibold">
              {t(lang, "emptyStateTitle")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(lang, "emptyStateSubtitle")}
            </p>
          </div>
        ) : (
          <>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {taxis.map((taxi, index) => (
                <li key={taxi.id} className="flex *:w-full">
                  <TaxiCard taxi={taxi} index={index} />
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav
                aria-label="Sayfalar"
                className="mt-8 flex items-center justify-center gap-2"
              >
                <Link
                  href={pageHref({
                    q,
                    region,
                    only: only24_7 ? "1" : undefined,
                    page: page - 1,
                  })}
                  aria-disabled={page <= 1}
                  className={`inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors ${
                    page <= 1
                      ? "pointer-events-none opacity-40"
                      : "hover:border-brand-strong hover:text-brand-strong"
                  }`}
                >
                  {lang === "tr" ? "Önceki" : "Previous"}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Link
                  href={pageHref({
                    q,
                    region,
                    only: only24_7 ? "1" : undefined,
                    page: page + 1,
                  })}
                  aria-disabled={page >= totalPages}
                  className={`inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors ${
                    page >= totalPages
                      ? "pointer-events-none opacity-40"
                      : "hover:border-brand-strong hover:text-brand-strong"
                  }`}
                >
                  {lang === "tr" ? "Sonraki" : "Next"}
                </Link>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
