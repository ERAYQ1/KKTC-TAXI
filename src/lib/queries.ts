import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Region, Taxi } from "@/lib/taxi";

export type TaxiFilters = {
  q?: string;
  region?: Region;
  only24_7?: boolean;
  page?: number;
  pageSize?: number;
};

export const DEFAULT_PAGE_SIZE = 12;

/**
 * Public listing. `active` is filtered explicitly (not only via RLS) so an
 * admin browsing the public site sees exactly what visitors see.
 */
export async function getPublicTaxis(
  filters: TaxiFilters = {},
): Promise<{ taxis: Taxi[]; total: number; page: number; pageSize: number }> {
  const supabase = await createClient();
  const requestedPage = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const searchTerm = filters.q?.replace(/[,()\\]/g, " ").trim();

  // PostgREST returns 416 (Requested range not satisfiable) when `from` is
  // past the last matching row, so the total must be known before the range
  // is chosen — a stale/out-of-bounds `page` param must not crash the page.
  let countQuery = supabase
    .from("taxis")
    .select("*", { count: "exact", head: true })
    .eq("active", true);
  if (filters.region) countQuery = countQuery.eq("region", filters.region);
  if (filters.only24_7) countQuery = countQuery.eq("is_24_7", true);
  if (searchTerm) {
    countQuery = countQuery.or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,price_info.ilike.%${searchTerm}%`,
    );
  }
  const { count, error: countError } = await countQuery;
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, totalPages);

  if (total === 0) {
    return { taxis: [], total: 0, page: 1, pageSize };
  }

  let dataQuery = supabase
    .from("taxis")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });
  if (filters.region) dataQuery = dataQuery.eq("region", filters.region);
  if (filters.only24_7) dataQuery = dataQuery.eq("is_24_7", true);
  if (searchTerm) {
    dataQuery = dataQuery.or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,price_info.ilike.%${searchTerm}%`,
    );
  }

  const from = (page - 1) * pageSize;
  const { data, error } = await dataQuery.range(from, from + pageSize - 1);
  if (error) throw new Error(error.message);
  return { taxis: (data ?? []) as Taxi[], total, page, pageSize };
}

/** Used by the favorites page to resolve locally-stored ids to full records. */
export async function getTaxisByIds(ids: string[]): Promise<Taxi[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("taxis")
    .select("*")
    .eq("active", true)
    .in("id", ids);

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
