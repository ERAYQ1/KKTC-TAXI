import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Reads the current user from the auth server (not just the cookie).
 * `cache` de-duplicates the call within a single request.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Authorisation gate for every admin page and Server Action.
 * Proxy only does an optimistic redirect; this is the real check.
 */
export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
