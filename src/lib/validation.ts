import { isRegion, normalisePhone, type Region } from "@/lib/taxi";

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type FieldErrors = Record<string, string>;

export type TaxiInput = {
  name: string;
  phone: string;
  whatsapp: string;
  price_info: string | null;
  region: Region;
  description: string | null;
  is_24_7: boolean;
  featured: boolean;
  active: boolean;
};

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function checked(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "true";
}

/** A KKTC/Turkish number must normalise to 12 digits: 90 + 10 local digits. */
function isValidPhone(raw: string): boolean {
  return /^90\d{10}$/.test(normalisePhone(raw));
}

export function parseTaxiForm(form: FormData): {
  data?: TaxiInput;
  fieldErrors?: FieldErrors;
} {
  const fieldErrors: FieldErrors = {};

  const name = text(form, "name");
  if (name.length < 2) {
    fieldErrors.name = "İsim en az 2 karakter olmalı.";
  } else if (name.length > 80) {
    fieldErrors.name = "İsim en fazla 80 karakter olabilir.";
  }

  const phone = text(form, "phone");
  if (!phone) {
    fieldErrors.phone = "Telefon numarası zorunlu.";
  } else if (!isValidPhone(phone)) {
    fieldErrors.phone = "Geçerli bir numara girin (örn. 0533 123 45 67).";
  }

  const whatsapp = text(form, "whatsapp") || phone;
  if (!isValidPhone(whatsapp)) {
    fieldErrors.whatsapp = "Geçerli bir WhatsApp numarası girin.";
  }

  const region = text(form, "region");
  if (!isRegion(region)) {
    fieldErrors.region = "Bölge seçin.";
  }

  const priceInfo = text(form, "price_info");
  if (priceInfo.length > 120) {
    fieldErrors.price_info = "Fiyat bilgisi en fazla 120 karakter olabilir.";
  }

  const description = text(form, "description");
  if (description.length > 1000) {
    fieldErrors.description = "Açıklama en fazla 1000 karakter olabilir.";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  return {
    data: {
      name,
      phone,
      whatsapp,
      price_info: priceInfo || null,
      region: region as Region,
      description: description || null,
      is_24_7: checked(form, "is_24_7"),
      featured: checked(form, "featured"),
      active: checked(form, "active"),
    },
  };
}

/**
 * Reads the leading bytes to confirm the file really is the image type it
 * claims. `File.type` comes from the client and can be forged, so a mislabelled
 * SVG (or anything else) must not pass on the declared MIME alone.
 */
async function sniffImageType(
  file: File,
): Promise<"jpg" | "png" | "webp" | null> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (header.length < 12) return null;

  const startsWith = (...bytes: number[]) =>
    bytes.every((byte, index) => header[index] === byte);

  if (startsWith(0xff, 0xd8, 0xff)) return "jpg";
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "png";
  // "RIFF" .... "WEBP"
  if (
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export type ReviewInput = {
  author_name: string;
  rating: number;
  comment: string | null;
};

export function parseReviewForm(form: FormData): {
  data?: ReviewInput;
  fieldErrors?: FieldErrors;
} {
  const fieldErrors: FieldErrors = {};

  const authorName = text(form, "author_name");
  if (authorName.length < 2) {
    fieldErrors.author_name = "İsim en az 2 karakter olmalı.";
  } else if (authorName.length > 60) {
    fieldErrors.author_name = "İsim en fazla 60 karakter olabilir.";
  }

  const ratingRaw = text(form, "rating");
  const rating = Number(ratingRaw);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    fieldErrors.rating = "1 ile 5 arasında bir puan seçin.";
  }

  const comment = text(form, "comment");
  if (comment.length > 500) {
    fieldErrors.comment = "Yorum en fazla 500 karakter olabilir.";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  return {
    data: {
      author_name: authorName,
      rating,
      comment: comment || null,
    },
  };
}

/** Validates an uploaded photo. Returns `null` when no file was submitted. */
export async function validatePhoto(
  value: FormDataEntryValue | null,
): Promise<{ file: File; ext: string } | { error: string } | null> {
  if (!(value instanceof File) || value.size === 0) return null;

  const declared =
    ALLOWED_PHOTO_TYPES[value.type as keyof typeof ALLOWED_PHOTO_TYPES];
  if (!declared) {
    return { error: "Fotoğraf JPG, PNG veya WebP olmalı." };
  }
  if (value.size > MAX_PHOTO_BYTES) {
    return { error: "Fotoğraf en fazla 2 MB olabilir." };
  }

  const actual = await sniffImageType(value);
  if (!actual || actual !== declared) {
    return { error: "Dosya geçerli bir JPG, PNG veya WebP görseli değil." };
  }

  return { file: value, ext: actual };
}
