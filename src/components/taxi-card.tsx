import Image from "next/image";
import Link from "next/link";
import { ContactButtons } from "@/components/contact-buttons";
import { FavoriteButton } from "@/components/favorite-button";
import { CarIcon, ClockIcon, MapPinIcon, StarIcon } from "@/components/icons";
import {
  localizedDescription,
  localizedPriceInfo,
  regionLabel,
  type Taxi,
} from "@/lib/taxi";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export async function TaxiCard({ taxi, index }: { taxi: Taxi; index: number }) {
  const lang = await getLang();
  const priceInfo = localizedPriceInfo(taxi, lang);
  const description = localizedDescription(taxi, lang);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-16/10 bg-brand-soft">
        {taxi.photo_url ? (
          <Image
            src={taxi.photo_url}
            alt={`${taxi.name} taksi aracı`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            // Docs advise loading/fetchPriority over `preload` for in-page
            // images; only the first card competes for LCP.
            loading={index < 3 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand">
            <CarIcon className="size-10" />
          </div>
        )}

        <FavoriteButton
          taxiId={taxi.id}
          addLabel={t(lang, "favoriteAdd")}
          removeLabel={t(lang, "favoriteRemove")}
          className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition-transform hover:scale-105"
        />

        {(taxi.featured || taxi.is_24_7) && (
          <ul className="absolute top-2 left-2 flex flex-wrap gap-1">
            {taxi.featured && (
              <li className="inline-flex items-center gap-1 rounded-full bg-brand-strong px-2 py-1 text-xs font-semibold text-white">
                <StarIcon className="size-3" />
                {t(lang, "featuredBadge")}
              </li>
            )}
            {taxi.is_24_7 && (
              <li className="inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2 py-1 text-xs font-semibold text-background">
                <ClockIcon className="size-3" />
                {t(lang, "filter24_7")}
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="font-display text-lg leading-tight font-semibold">
            <Link
              href={`/taksi/${taxi.id}`}
              className="rounded transition-colors hover:text-brand-strong"
            >
              {taxi.name}
            </Link>
          </h3>

          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            {regionLabel(taxi.region)}
          </p>

          {priceInfo && (
            <p className="mt-2 text-sm font-medium text-foreground">
              {priceInfo}
            </p>
          )}

          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <ContactButtons
          name={taxi.name}
          phone={taxi.phone}
          whatsapp={taxi.whatsapp}
        />
      </div>
    </article>
  );
}
