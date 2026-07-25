"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLang, LANG_COOKIE } from "@/lib/i18n";

export async function setLang(formData: FormData) {
  const lang = formData.get("lang");
  if (isLang(lang)) {
    const cookieStore = await cookies();
    cookieStore.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  const h = await headers();
  const referer = h.get("referer");
  redirect(referer ?? "/");
}
