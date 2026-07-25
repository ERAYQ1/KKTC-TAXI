import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Yönetici Girişi",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-2xl font-bold tracking-tight">
        Yönetici Girişi
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Taksi kayıtlarını yönetmek için giriş yapın.
      </p>
      <LoginForm />
    </div>
  );
}
