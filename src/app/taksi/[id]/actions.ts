"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseReviewForm, type FieldErrors } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export type ReviewFormState = {
  error?: string;
  fieldErrors?: FieldErrors;
  success?: boolean;
};

const REVIEW_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

export async function submitReview(
  taxiId: string,
  _prev: ReviewFormState,
  form: FormData,
): Promise<ReviewFormState> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`review:${ip}`, REVIEW_LIMIT);
  if (!rateLimit.allowed) {
    return { error: "Çok fazla yorum gönderildi. Daha sonra tekrar deneyin." };
  }

  const parsed = parseReviewForm(form);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    taxi_id: taxiId,
    author_name: parsed.data.author_name,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    approved: false,
  });

  if (error) {
    return { error: "Yorum gönderilemedi. Tekrar deneyin." };
  }

  revalidatePath(`/taksi/${taxiId}`);
  return { success: true };
}
