import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/review-utils";

export type { Review } from "@/lib/review-utils";
export { averageRating } from "@/lib/review-utils";

export async function getApprovedReviews(taxiId: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("taxi_id", taxiId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

/** Admin moderation queue: every review, newest first. Caller must be authorised. */
export async function getAllReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}
