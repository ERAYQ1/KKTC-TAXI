import Image from "next/image";
import Link from "next/link";
import { deleteTaxi, toggleTaxiActive } from "@/app/admin/actions";
import { ConfirmButton } from "./confirm-button";
import { CarIcon } from "@/components/icons";
import { getAllTaxis } from "@/lib/queries";
import { formatPhone, regionLabel } from "@/lib/taxi";

export default async function AdminDashboardPage() {
  const taxis = await getAllTaxis();
  const activeCount = taxis.filter((t) => t.active).length;

  return (
    <div className="py-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-xl font-semibold">Taksiler</h1>
        <p className="text-sm text-muted-foreground">
          {activeCount} aktif / {taxis.length} toplam
        </p>
      </div>

      {taxis.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-brand-soft px-6 py-14 text-center">
          <CarIcon className="mx-auto size-10 text-brand" />
          <p className="mt-4 font-display text-lg font-semibold">
            Henüz taksi eklenmedi
          </p>
          <Link
            href="/admin/taksiler/yeni"
            className="mt-4 inline-flex h-11 items-center rounded-lg bg-brand-strong px-5 text-sm font-semibold text-white"
          >
            İlk taksiyi ekle
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {taxis.map((taxi) => (
            <li
              key={taxi.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-3"
            >
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
                      ★ öne çıkan
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
                {taxi.active ? "Aktif" : "Pasif"}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/taksiler/${taxi.id}/duzenle`}
                  className="inline-flex h-11 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
                >
                  Düzenle
                </Link>

                <form action={toggleTaxiActive.bind(null, taxi.id, !taxi.active)}>
                  <ConfirmButton
                    confirmMessage={
                      taxi.active
                        ? `"${taxi.name}" pasife alınsın mı? Sitede görünmeyecek.`
                        : `"${taxi.name}" aktif edilsin mi?`
                    }
                    className="h-11 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-brand-soft"
                  >
                    {taxi.active ? "Pasife al" : "Aktif et"}
                  </ConfirmButton>
                </form>

                <form action={deleteTaxi.bind(null, taxi.id)}>
                  <ConfirmButton
                    confirmMessage={`"${taxi.name}" kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`}
                    className="h-11 rounded-lg border border-destructive/40 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Sil
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
