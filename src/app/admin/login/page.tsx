import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = {
  title: "Yönetici Girişi",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const lang = await getLang();
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {t(lang, "adminLoginHeading")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(lang, "adminLoginSubtitle")}
      </p>
      <LoginForm lang={lang} />
    </div>
  );
}
