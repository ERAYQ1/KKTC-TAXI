"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export async function approveReview(id: string, taxiId: string) {
  const user = await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ approved: true })
    .eq("id", id);

  if (error) throw new Error(t(await getLang(), "errReviewApproveFailed"));

  await logAudit(user.email ?? user.id, "approve_review", { taxiId });
  revalidatePath("/admin/yorumlar");
  revalidatePath(`/taksi/${taxiId}`);
}

export async function deleteReview(id: string, taxiId: string) {
  const user = await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(t(await getLang(), "errReviewDeleteFailed"));

  await logAudit(user.email ?? user.id, "delete_review", { taxiId });
  revalidatePath("/admin/yorumlar");
  revalidatePath(`/taksi/${taxiId}`);
}
