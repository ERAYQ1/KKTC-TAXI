import type { Metadata } from "next";
import { getAuditLog } from "@/lib/audit";
import { t, type DictKey, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = {
  title: "İşlem Geçmişi",
  robots: { index: false, follow: false },
};

const ACTION_LABEL_KEYS: Record<string, DictKey> = {
  login_failed: "auditLoginFailed",
  create_taxi: "auditCreateTaxi",
  update_taxi: "auditUpdateTaxi",
  delete_taxi: "auditDeleteTaxi",
  activate_taxi: "auditActivateTaxi",
  deactivate_taxi: "auditDeactivateTaxi",
  bulk_activate: "auditBulkActivate",
  bulk_deactivate: "auditBulkDeactivate",
  bulk_delete: "auditBulkDelete",
  approve_review: "auditApproveReview",
  delete_review: "auditDeleteReview",
};

function actionLabel(lang: Lang, action: string): string {
  const key = ACTION_LABEL_KEYS[action];
  return key ? t(lang, key) : action;
}

export default async function AdminAuditLogPage() {
  const [entries, lang] = await Promise.all([getAuditLog(), getLang()]);

  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">{t(lang, "adminHistoryHeading")}</h1>
      <p className="text-sm text-muted-foreground">
        {t(lang, "adminHistoryLastNTemplate", { n: entries.length })}
      </p>

      {entries.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{t(lang, "adminHistoryEmpty")}</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <div>
                <span className="font-medium">
                  {actionLabel(lang, entry.action)}
                </span>
                <span className="ml-2 text-muted-foreground">
                  {entry.actor_email}
                </span>
              </div>
              <time
                dateTime={entry.created_at}
                className="text-xs text-muted-foreground"
              >
                {new Date(entry.created_at).toLocaleString(lang === "en" ? "en-GB" : "tr-TR")}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
