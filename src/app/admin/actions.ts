"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { parseTaxiForm, validatePhoto, type FieldErrors } from "@/lib/validation";

const BUCKET = "taxi-photos";

export type FormState = {
  error?: string;
  fieldErrors?: FieldErrors;
};

/** Public storage URLs look like .../object/public/taxi-photos/<name>. */
function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

function revalidateTaxi(id?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (id) revalidatePath(`/taksi/${id}`);
}

async function uploadPhoto(
  form: FormData,
): Promise<{ url?: string; error?: string }> {
  const photo = await validatePhoto(form.get("photo"));
  if (!photo) return {};
  if ("error" in photo) return { error: photo.error };

  const supabase = await createClient();
  // Filename is generated server-side; the client-supplied name is never used.
  const path = `${crypto.randomUUID()}.${photo.ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, photo.file, {
      contentType: photo.file.type,
      upsert: false,
    });

  if (error) return { error: "Fotoğraf yüklenemedi. Tekrar deneyin." };

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: publicUrl };
}

async function removePhoto(url: string | null) {
  const path = storagePathFromUrl(url);
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function createTaxi(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseTaxiForm(form);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  const photo = await uploadPhoto(form);
  if (photo.error) return { error: photo.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("taxis")
    .insert({ ...parsed.data, photo_url: photo.url ?? null });

  if (error) {
    await removePhoto(photo.url ?? null);
    return { error: "Taksi kaydedilemedi. Tekrar deneyin." };
  }

  revalidateTaxi();
  redirect("/admin");
}

export async function updateTaxi(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = form.get("id");
  if (typeof id !== "string" || !id) return { error: "Geçersiz kayıt." };

  const parsed = parseTaxiForm(form);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("taxis")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  const photo = await uploadPhoto(form);
  if (photo.error) return { error: photo.error };

  const { error } = await supabase
    .from("taxis")
    .update({
      ...parsed.data,
      ...(photo.url ? { photo_url: photo.url } : {}),
    })
    .eq("id", id);

  if (error) {
    await removePhoto(photo.url ?? null);
    return { error: "Taksi güncellenemedi. Tekrar deneyin." };
  }

  // Replaced photo is only dropped once the row points at the new one.
  if (photo.url) {
    await removePhoto((existing?.photo_url as string | null) ?? null);
  }

  revalidateTaxi(id);
  redirect("/admin");
}

export async function toggleTaxiActive(id: string, active: boolean) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("taxis")
    .update({ active })
    .eq("id", id);

  if (error) throw new Error("Durum güncellenemedi.");
  revalidateTaxi(id);
}

export async function deleteTaxi(id: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("taxis")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("taxis").delete().eq("id", id);
  if (error) throw new Error("Taksi silinemedi.");

  await removePhoto((existing?.photo_url as string | null) ?? null);
  revalidateTaxi(id);
}
