"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "E-posta ve şifre gerekli." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  // Deliberately generic: never reveal whether the account exists.
  if (error) {
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
