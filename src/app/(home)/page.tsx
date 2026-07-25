import type { Metadata } from "next";
import { TaxiCard } from "@/components/taxi-card";
import { TaxiFilters } from "@/components/taxi-filters";
import { CarIcon } from "@/components/icons";
import { getPublicTaxis } from "@/lib/queries";
import { isRegion, regionLabel } from "@/lib/taxi";

export const metadata: Metadata = {
  // `absolute` avoids the layout template appending the site name twice.
  title: { absolute: "KKTC Taksi | Kıbrıs'ta Hızlı Taksi Bulun" },
  description:
    "Lefkoşa, Girne, Gazimağusa, İskele, Güzelyurt ve Lefke'deki taksileri tek dokunuşla arayın veya WhatsApp'tan yazın.",
  alternates: { canonical: "/" },
};

type Props = {
  searchParams: Promise<{ q?: string; region?: string; only?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const region = isRegion(sp.region) ? sp.region : undefined;
  const only24_7 = sp.only === "1";

  const taxis = await getPublicTaxis({ q, region, only24_7 });

  const heading = region
    ? `${regionLabel(region)} taksileri`
    : "Tüm taksiler";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="max-w-2xl">
        <h1 className="font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
          KKTC&apos;de taksiye{" "}
          <span className="text-brand">tek dokunuşla</span> ulaşın
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Bölgenizdeki taksiyi bulun, doğrudan arayın veya WhatsApp&apos;tan
          hazır mesajla yazın. Kayıt gerekmez.
        </p>
      </section>

      <div className="mt-8">
        <TaxiFilters q={q} region={region} only24_7={only24_7} />
      </div>

      <section className="mt-8" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-semibold">{heading}</h2>
          <p className="text-sm text-muted-foreground">
            {taxis.length} taksi
          </p>
        </div>

        {taxis.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-brand-soft px-6 py-14 text-center">
            <CarIcon className="mx-auto size-10 text-brand" />
            <p className="mt-4 font-display text-lg font-semibold">
              Aramanıza uygun taksi bulunamadı
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Farklı bir bölge seçmeyi veya aramanızı sadeleştirmeyi deneyin.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {taxis.map((taxi, index) => (
              <li key={taxi.id} className="flex *:w-full">
                <TaxiCard taxi={taxi} index={index} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
