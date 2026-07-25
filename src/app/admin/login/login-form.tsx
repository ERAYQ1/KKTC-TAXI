"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { t, type Lang } from "@/lib/i18n";

const initialState: LoginState = {};

const field =
  "h-12 w-full rounded-lg border border-border bg-surface px-3 text-base";

export function LoginForm({ lang }: { lang: Lang }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          {t(lang, "adminEmailLabel")} <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`mt-1.5 ${field}`}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          {t(lang, "adminPasswordLabel")} <span className="text-destructive">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`mt-1.5 ${field}`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-lg bg-brand-strong font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
      >
        {pending ? t(lang, "adminLoggingIn") : t(lang, "adminLoginSubmit")}
      </button>
    </form>
  );
}
