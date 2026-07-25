import type { Lang } from "@/lib/i18n";

export const REGIONS = [
  { value: "lefkosa", label: "Lefkoşa" },
  { value: "girne", label: "Girne" },
  { value: "gazimagusa", label: "Gazimağusa" },
  { value: "iskele", label: "İskele" },
  { value: "guzelyurt", label: "Güzelyurt" },
  { value: "lefke", label: "Lefke" },
  { value: "diger", label: "Diğer" },
] as const;

export type Region = (typeof REGIONS)[number]["value"];

export const REGION_VALUES = REGIONS.map((r) => r.value) as readonly Region[];

export function isRegion(value: unknown): value is Region {
  return (
    typeof value === "string" && REGION_VALUES.includes(value as Region)
  );
}

export function regionLabel(value: string): string {
  return REGIONS.find((r) => r.value === value)?.label ?? "Diğer";
}

export type Taxi = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  photo_url: string | null;
  price_info: string | null;
  price_info_en: string | null;
  region: Region;
  description: string | null;
  description_en: string | null;
  is_24_7: boolean;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

/** English content falls back to the Turkish column when the admin left it empty. */
export function localizedDescription(taxi: Taxi, lang: Lang): string | null {
  if (lang === "en") return taxi.description_en || taxi.description;
  return taxi.description;
}

export function localizedPriceInfo(taxi: Taxi, lang: Lang): string | null {
  if (lang === "en") return taxi.price_info_en || taxi.price_info;
  return taxi.price_info;
}

export const WHATSAPP_MESSAGE = "Merhaba, KKTC Taksi'den geldim.";

/**
 * Normalises a KKTC/Turkish number into the digits-only form wa.me expects.
 * Accepts "0533 123 45 67", "+90 533 ...", "533 ...".
 */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

export function telHref(raw: string): string {
  return `tel:+${normalisePhone(raw)}`;
}

export function whatsappHref(raw: string): string {
  return `https://wa.me/${normalisePhone(raw)}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;
}

export function formatPhone(raw: string): string {
  const digits = normalisePhone(raw);
  const local = digits.startsWith("90") ? digits.slice(2) : digits;
  if (local.length !== 10) return raw;
  return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(
    6,
    8,
  )} ${local.slice(8)}`;
}
