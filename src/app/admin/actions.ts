"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { parseTaxiForm, validatePhoto, type FieldErrors } from "@/lib/validation";
import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { t, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

const BUCKET = "taxi-photos";

/** Guards against a runaway script/misbehaving client, not normal admin use. */
const WRITE_LIMIT = { limit: 30, windowMs: 60 * 1000 };

async function assertNotRateLimited(email: string) {
  const result = checkRateLimit(`admin-write:${email}`, WRITE_LIMIT);
  if (!result.allowed) {
    throw new Error(t(await getLang(), "errTooManyWrites"));
  }
}

function idsFrom(formData: FormData): string[] {
  return formData
    .getAll("ids")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

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
  lang: Lang,
): Promise<{ url?: string; error?: string }> {
  const photo = await validatePhoto(form.get("photo"), lang);
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

  if (error) return { error: t(lang, "errPhotoUploadFailed") };

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
  const user = await requireAdmin();
  await assertNotRateLimited(user.email ?? user.id);
  const lang = await getLang();

  const parsed = parseTaxiForm(form, lang);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  const photo = await uploadPhoto(form, lang);
  if (photo.error) return { error: photo.error };

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("taxis")
    .insert({ ...parsed.data, photo_url: photo.url ?? null })
    .select("id")
    .single();

  if (error) {
    await removePhoto(photo.url ?? null);
    return { error: t(lang, "errTaxiCreateFailed") };
  }

  await logAudit(user.email ?? user.id, "create_taxi", {
    taxiId: inserted.id as string,
    meta: { name: parsed.data.name },
  });

  revalidateTaxi();
  redirect("/admin");
}

export async function updateTaxi(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const user = await requireAdmin();
  await assertNotRateLimited(user.email ?? user.id);
  const lang = await getLang();

  const id = form.get("id");
  if (typeof id !== "string" || !id) return { error: t(lang, "errInvalidRecord") };

  const parsed = parseTaxiForm(form, lang);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("taxis")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  const photo = await uploadPhoto(form, lang);
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
    return { error: t(lang, "errTaxiUpdateFailed") };
  }

  // Replaced photo is only dropped once the row points at the new one.
  if (photo.url) {
    await removePhoto((existing?.photo_url as string | null) ?? null);
  }

  await logAudit(user.email ?? user.id, "update_taxi", { taxiId: id });

  revalidateTaxi(id);
  redirect("/admin");
}

export async function toggleTaxiActive(id: string, active: boolean) {
  const user = await requireAdmin();
  await assertNotRateLimited(user.email ?? user.id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("taxis")
    .update({ active })
    .eq("id", id);

  if (error) throw new Error(t(await getLang(), "errStatusUpdateFailed"));

  await logAudit(user.email ?? user.id, active ? "activate_taxi" : "deactivate_taxi", {
    taxiId: id,
  });

  revalidateTaxi(id);
}

export async function deleteTaxi(id: string) {
  const user = await requireAdmin();
  await assertNotRateLimited(user.email ?? user.id);

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("taxis")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("taxis").delete().eq("id", id);
  if (error) throw new Error(t(await getLang(), "errTaxiDeleteFailed"));

  await removePhoto((existing?.photo_url as string | null) ?? null);
  await logAudit(user.email ?? user.id, "delete_taxi", { taxiId: id });
  revalidateTaxi(id);
}

export async function bulkSetActive(active: boolean, formData: FormData) {
  const user = await requireAdmin();
  await assertNotRateLimited(user.email ?? user.id);

  const ids = idsFrom(formData);
  if (ids.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("taxis")
    .update({ active })
    .in("id", ids);

  if (error) throw new Error(t(await getLang(), "errBulkUpdateFailed"));

  await logAudit(user.email ?? user.id, active ? "bulk_activate" : "bulk_deactivate", {
    meta: { ids },
  });

  for (const id of ids) revalidateTaxi(id);
  revalidateTaxi();
}

export async function bulkDelete(formData: FormData) {
  const user = await requireAdmin();
  await assertNotRateLimited(user.email ?? user.id);

  const ids = idsFrom(formData);
  if (ids.length === 0) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("taxis")
    .select("id, photo_url")
    .in("id", ids);

  const { error } = await supabase.from("taxis").delete().in("id", ids);
  if (error) throw new Error(t(await getLang(), "errBulkDeleteFailed"));

  for (const row of existing ?? []) {
    await removePhoto((row.photo_url as string | null) ?? null);
  }

  await logAudit(user.email ?? user.id, "bulk_delete", { meta: { ids } });
  revalidateTaxi();
}
