import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Region, Taxi } from "@/lib/taxi";

export type TaxiFilters = {
  q?: string;
  region?: Region;
  only24_7?: boolean;
};

/**
 * Public listing. `active` is filtered explicitly (not only via RLS) so an
 * admin browsing the public site sees exactly what visitors see.
 */
export async function getPublicTaxis(filters: TaxiFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("taxis")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (filters.region) {
    query = query.eq("region", filters.region);
  }
  if (filters.only24_7) {
    query = query.eq("is_24_7", true);
  }
  if (filters.q) {
    // Escape PostgREST `or` filter separators before interpolating.
    const term = filters.q.replace(/[,()\\]/g, " ").trim();
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,description.ilike.%${term}%,price_info.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Taxi[];
}

/**
 * `cache` de-duplicates the lookup within one request: the detail route calls
 * this from both `generateMetadata` and the page body.
 */
export const getPublicTaxi = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxis")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Taxi | null) ?? null;
});

/** Admin listing: every taxi, newest first. Caller must be authorised. */
export async function getAllTaxis() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Taxi[];
}

export async function getTaxiById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxis")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Taxi | null) ?? null;
}
