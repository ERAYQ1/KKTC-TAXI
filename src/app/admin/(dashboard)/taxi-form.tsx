"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "./confirm-button";
import type { FormState } from "@/app/admin/actions";
import { REGIONS, type Taxi } from "@/lib/taxi";
import { MAX_PHOTO_BYTES } from "@/lib/validation";

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  taxi?: Taxi;
  submitLabel: string;
};

const field =
  "mt-1.5 h-12 w-full rounded-lg border border-border bg-surface px-3 text-base";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-destructive">
      {message}
    </p>
  );
}

/** Links an input to its error text so screen readers announce the reason. */
function describedBy(field: string, message?: string) {
  return message ? `${field}-error` : undefined;
}

export function TaxiForm({ action, taxi, submitLabel }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-5">
      {taxi && <input type="hidden" name="id" value={taxi.id} />}

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Taksi / şoför adı <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          defaultValue={taxi?.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name", errors.name)}
          className={field}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Telefon <span className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="0533 123 45 67"
            defaultValue={taxi?.phone}
            aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone", errors.phone)}
            className={field}
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            placeholder="Boş bırakılırsa telefon kullanılır"
            defaultValue={taxi?.whatsapp}
            aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={describedBy("whatsapp", errors.whatsapp)}
            className={field}
          />
          <FieldError id="whatsapp-error" message={errors.whatsapp} />
        </div>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium">
          Bölge <span className="text-destructive">*</span>
        </label>
        <select
          id="region"
          name="region"
          required
          defaultValue={taxi?.region ?? ""}
          aria-invalid={Boolean(errors.region)}
          aria-describedby={describedBy("region", errors.region)}
          className={field}
        >
          <option value="" disabled>
            Bölge seçin
          </option>
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <FieldError id="region-error" message={errors.region} />
      </div>

      <div>
        <label htmlFor="price_info" className="block text-sm font-medium">
          Fiyat bilgisi
        </label>
        <input
          id="price_info"
          name="price_info"
          maxLength={120}
          placeholder="Örn. Şehir içi 150 TL, havalimanı 600 TL"
          defaultValue={taxi?.price_info ?? ""}
          aria-invalid={Boolean(errors.price_info)}
          aria-describedby={describedBy("price_info", errors.price_info)}
          className={field}
        />
        <FieldError id="price_info-error" message={errors.price_info} />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          defaultValue={taxi?.description ?? ""}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={describedBy("description", errors.description)}
          className="mt-1.5 w-full rounded-lg border border-border bg-surface p-3 text-base"
        />
        <FieldError id="description-error" message={errors.description} />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium">
          Fotoğraf
        </label>
        {taxi?.photo_url && (
          <div className="relative mt-2 aspect-16/10 w-40 overflow-hidden rounded-lg border border-border">
            <Image
              src={taxi.photo_url}
              alt="Mevcut fotoğraf"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        )}
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby="photo-help"
          className="mt-2 w-full text-sm"
        />
        <p id="photo-help" className="mt-1 text-xs text-muted-foreground">
          JPG, PNG veya WebP · en fazla {MAX_PHOTO_BYTES / (1024 * 1024)} MB
          {taxi?.photo_url && " · yeni dosya seçmezseniz mevcut fotoğraf kalır"}
        </p>
      </div>

      <fieldset className="space-y-3 rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-medium">Ayarlar</legend>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={taxi ? taxi.active : true}
            className="size-5 accent-[var(--brand-strong)]"
          />
          Sitede yayında
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="is_24_7"
            defaultChecked={taxi?.is_24_7 ?? false}
            className="size-5 accent-[var(--brand-strong)]"
          />
          7/24 hizmet veriyor
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={taxi?.featured ?? false}
            className="size-5 accent-[var(--brand-strong)]"
          />
          Öne çıkar (listede üstte gösterilir)
        </label>
      </fieldset>

      <div className="flex items-center gap-3">
        <SubmitButton
          pendingLabel="Kaydediliyor…"
          className="h-12 rounded-lg bg-brand-strong px-6 font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
        >
          {submitLabel}
        </SubmitButton>
        <Link
          href="/admin"
          className="inline-flex h-12 items-center rounded-lg border border-border px-5 font-medium transition-colors hover:bg-brand-soft"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
