"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export type LoginState = { error?: string };

const LOGIN_LIMIT = { limit: 5, windowMs: 5 * 60 * 1000 };

export async function login(
  _prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "E-posta ve şifre gerekli." };
  }

  const ip = await getClientIp();
  // Keyed by IP + email so one attacker can't lock out a legitimate admin's
  // email from a different IP, while still capping brute-force per-source.
  const rateLimit = checkRateLimit(`login:${ip}:${email.trim().toLowerCase()}`, LOGIN_LIMIT);
  if (!rateLimit.allowed) {
    const retryMinutes = Math.ceil(rateLimit.retryAfterMs / 60000);
    return {
      error: `Çok fazla deneme yapıldı. ${retryMinutes} dakika sonra tekrar deneyin.`,
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
    return { error: "E-posta veya şifre hatalı." };
  }

  // Fixed destination — no user-controlled redirect target.
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
