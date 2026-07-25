import Image from "next/image";
import Link from "next/link";
import {
  bulkDelete,
  bulkSetActive,
  deleteTaxi,
  toggleTaxiActive,
} from "@/app/admin/actions";
import { ConfirmButton } from "./confirm-button";
import { CarIcon } from "@/components/icons";
import { getAllTaxis } from "@/lib/queries";
import { formatPhone, REGIONS, regionLabel } from "@/lib/taxi";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export default async function AdminDashboardPage() {
  const [taxis, lang] = await Promise.all([getAllTaxis(), getLang()]);
  const activeCount = taxis.filter((t) => t.active).length;
  const featuredCount = taxis.filter((t) => t.featured).length;
  const byRegion = REGIONS.map((r) => ({
    label: r.label,
    count: taxis.filter((t) => t.region === r.value).length,
  })).filter((r) => r.count > 0);

  return (
    <div className="py-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-xl font-semibold">{t(lang, "adminDashboardHeading")}</h1>
        <p className="text-sm text-muted-foreground">
          {t(lang, "adminActiveOfTotalTemplate", { active: activeCount, total: taxis.length })}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <dt className="text-xs text-muted-foreground">{t(lang, "adminStatTotal")}</dt>
          <dd className="mt-1 font-display text-2xl font-semibold">
            {taxis.length}
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <dt className="text-xs text-muted-foreground">{t(lang, "adminStatActive")}</dt>
          <dd className="mt-1 font-display text-2xl font-semibold text-whatsapp">
            {activeCount}
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <dt className="text-xs text-muted-foreground">{t(lang, "adminStatInactive")}</dt>
          <dd className="mt-1 font-display text-2xl font-semibold">
            {taxis.length - activeCount}
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <dt className="text-xs text-muted-foreground">{t(lang, "adminStatFeatured")}</dt>
          <dd className="mt-1 font-display text-2xl font-semibold text-brand-strong">
            {featuredCount}
          </dd>
        </div>
      </dl>

      {byRegion.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {byRegion.map((r) => (
            <span
              key={r.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium"
            >
              {r.label}
              <span className="text-muted-foreground">{r.count}</span>
            </span>
          ))}
        </div>
      )}

      {taxis.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-brand-soft px-6 py-14 text-center">
          <CarIcon className="mx-auto size-10 text-brand" />
          <p className="mt-4 font-display text-lg font-semibold">
            {t(lang, "adminEmptyTitle")}
          </p>
          <Link
            href="/admin/taksiler/yeni"
            className="mt-4 inline-flex h-11 items-center rounded-lg bg-brand-strong px-5 text-sm font-semibold text-white"
          >
            {t(lang, "adminEmptyCta")}
          </Link>
        </div>
      ) : (
        <form>
          <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">
              {t(lang, "adminSelected")}
            </span>
            <ConfirmButton
              confirmMessage={t(lang, "adminConfirmBulkActivate")}
              formAction={bulkSetActive.bind(null, true)}
              className="h-9 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
            >
              {t(lang, "adminBulkActivate")}
            </ConfirmButton>
            <ConfirmButton
              confirmMessage={t(lang, "adminConfirmBulkDeactivate")}
              formAction={bulkSetActive.bind(null, false)}
              className="h-9 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
            >
              {t(lang, "adminBulkDeactivate")}
            </ConfirmButton>
            <ConfirmButton
              confirmMessage={t(lang, "adminConfirmBulkDelete")}
              formAction={bulkDelete}
              className="h-9 rounded-lg border border-destructive/40 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              {t(lang, "adminBulkDelete")}
            </ConfirmButton>
          </div>

          <ul className="mt-3 space-y-3">
            {taxis.map((taxi) => (
              <li
                key={taxi.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-3"
              >
                <input
                  type="checkbox"
                  name="ids"
                  value={taxi.id}
                  aria-label={t(lang, "adminSelectAriaTemplate", { name: taxi.name })}
                  className="size-5 shrink-0 accent-[var(--brand-strong)]"
                />

                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-brand-soft">
                  {taxi.photo_url ? (
                    <Image
                      src={taxi.photo_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-brand">
                      <CarIcon className="size-6" />
                    </span>
                  )}
                </div>

                <div className="min-w-40 flex-1">
                  <p className="font-display font-semibold">
                    {taxi.name}
                    {taxi.featured && (
                      <span className="ml-2 align-middle text-xs font-semibold text-brand-strong">
                        ★ {t(lang, "adminFeaturedBadge")}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {regionLabel(taxi.region)} · {formatPhone(taxi.phone)}
                    {taxi.is_24_7 && " · 7/24"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    taxi.active
                      ? "bg-whatsapp/15 text-whatsapp"
                      : "bg-foreground/15 text-foreground"
                  }`}
                >
                  {taxi.active ? t(lang, "adminStatActive") : t(lang, "adminStatInactive")}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/taksiler/${taxi.id}/duzenle`}
                    className="inline-flex h-11 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
                  >
                    {t(lang, "adminEdit")}
                  </Link>

                  <ConfirmButton
                    confirmMessage={
                      taxi.active
                        ? t(lang, "adminConfirmDeactivateOneTemplate", { name: taxi.name })
                        : t(lang, "adminConfirmActivateOneTemplate", { name: taxi.name })
                    }
                    formAction={toggleTaxiActive.bind(null, taxi.id, !taxi.active)}
                    className="h-11 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
                  >
                    {taxi.active ? t(lang, "adminBulkDeactivate") : t(lang, "adminBulkActivate")}
                  </ConfirmButton>

                  <ConfirmButton
                    confirmMessage={t(lang, "adminConfirmDeleteOneTemplate", { name: taxi.name })}
                    formAction={deleteTaxi.bind(null, taxi.id)}
                    className="h-11 rounded-lg border border-destructive/40 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    {t(lang, "adminBulkDelete")}
                  </ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </form>
      )}
    </div>
  );
}
