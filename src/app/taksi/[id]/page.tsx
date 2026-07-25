import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButtons } from "@/components/contact-buttons";
import { FavoriteButton } from "@/components/favorite-button";
import { ReviewForm } from "@/components/review-form";
import {
  ArrowLeftIcon,
  CarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "@/components/icons";
import { getPublicTaxi } from "@/lib/queries";
import { formatPhone, regionLabel } from "@/lib/taxi";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { averageRating, getApprovedReviews } from "@/lib/reviews";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const taxi = await getPublicTaxi(id);

  if (!taxi) {
    return { title: "Taksi bulunamadı" };
  }

  const region = regionLabel(taxi.region);
  return {
    // The root layout template appends "| KKTC Taksi".
    title: `${taxi.name} — ${region} Taksi`,
    description:
      taxi.description?.slice(0, 155) ||
      `${region} bölgesinde ${taxi.name}. Tek dokunuşla arayın veya WhatsApp'tan yazın.`,
    alternates: { canonical: `/taksi/${taxi.id}` },
  };
}

export default async function TaxiDetailPage({ params }: Props) {
  const { id } = await params;
  const [taxi, lang] = await Promise.all([getPublicTaxi(id), getLang()]);

  if (!taxi) notFound();

  const reviews = await getApprovedReviews(taxi.id);
  const avgRating = averageRating(reviews);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:py-10 sm:pb-10">
      <Link
        href="/"
        className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-strong"
      >
        <ArrowLeftIcon className="size-4" />
        {t(lang, "backToAll")}
      </Link>

      <article className="mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="relative aspect-16/10 bg-brand-soft sm:aspect-21/9">
          {taxi.photo_url ? (
            <Image
              src={taxi.photo_url}
              alt={`${taxi.name} taksi aracı`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              preload
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand">
              <CarIcon className="size-14" />
            </div>
          )}

          <FavoriteButton
            taxiId={taxi.id}
            addLabel={t(lang, "favoriteAdd")}
            removeLabel={t(lang, "favoriteRemove")}
            className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition-transform hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {taxi.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-strong px-2.5 py-1 text-xs font-semibold text-white">
                <StarIcon className="size-3" />
                {t(lang, "featuredBadge")}
              </span>
            )}
            {taxi.is_24_7 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-semibold text-background">
                <ClockIcon className="size-3" />
                {t(lang, "hoursBadge")}
              </span>
            )}
            {avgRating !== null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-strong">
                <StarIcon className="size-3" />
                {avgRating} ({reviews.length})
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {taxi.name}
          </h1>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Bölge</dt>
              <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
              <dd>{regionLabel(taxi.region)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Telefon</dt>
              <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
              <dd>{formatPhone(taxi.phone)}</dd>
            </div>
            {taxi.price_info && (
              <div className="flex items-baseline gap-2">
                <dt className="text-muted-foreground">{t(lang, "priceLabel")}</dt>
                <dd className="font-medium">{taxi.price_info}</dd>
              </div>
            )}
          </dl>

          {taxi.description && (
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {taxi.description}
            </p>
          )}

          <div className="mt-6 hidden sm:block">
            <ContactButtons
              name={taxi.name}
              phone={taxi.phone}
              whatsapp={taxi.whatsapp}
              size="lg"
            />
          </div>
        </div>
      </article>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-semibold">
          {t(lang, "reviewsTitle")}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t(lang, "reviewsEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{review.author_name}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-strong">
                    <StarIcon className="size-3.5" />
                    {review.rating}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-lg border border-border bg-surface p-4">
          <ReviewForm
            taxiId={taxi.id}
            copy={{
              title: t(lang, "reviewFormTitle"),
              note: t(lang, "reviewFormNote"),
              nameLabel: t(lang, "reviewNameLabel"),
              ratingLabel: t(lang, "reviewRatingLabel"),
              commentLabel: t(lang, "reviewCommentLabel"),
              submitLabel: t(lang, "reviewSubmit"),
              submittedMessage: t(lang, "reviewSubmitted"),
            }}
          />
        </div>
      </section>

      {/* Thumb-reachable CTA on mobile. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <ContactButtons
          name={taxi.name}
          phone={taxi.phone}
          whatsapp={taxi.whatsapp}
          size="lg"
        />
      </div>
    </div>
  );
}
