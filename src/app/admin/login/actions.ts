"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export type LoginState = { error?: string };

const LOGIN_LIMIT = { limit: 5, windowMs: 5 * 60 * 1000 };

export async function login(
  _prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const lang = await getLang();
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: t(lang, "errEmailPasswordRequired") };
  }

  const ip = await getClientIp();
  // Keyed by IP + email so one attacker can't lock out a legitimate admin's
  // email from a different IP, while still capping brute-force per-source.
  const rateLimit = checkRateLimit(`login:${ip}:${email.trim().toLowerCase()}`, LOGIN_LIMIT);
  if (!rateLimit.allowed) {
    const retryMinutes = Math.ceil(rateLimit.retryAfterMs / 60000);
    return {
      error: t(lang, "errTooManyLoginAttemptsTemplate", { n: retryMinutes }),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  // Deliberately generic: never reveal whether the account exists.
  if (error) {
    await logAudit(email.trim(), "login_failed", { meta: { ip } });
    return { error: t(lang, "errInvalidCredentials") };
  }

  // Fixed destination — no user-controlled redirect target.
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
