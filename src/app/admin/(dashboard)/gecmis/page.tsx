import type { Metadata } from "next";
import { getAuditLog } from "@/lib/audit";

export const metadata: Metadata = {
  title: "İşlem Geçmişi",
  robots: { index: false, follow: false },
};

const ACTION_LABELS: Record<string, string> = {
  login_failed: "Başarısız giriş",
  create_taxi: "Taksi eklendi",
  update_taxi: "Taksi güncellendi",
  delete_taxi: "Taksi silindi",
  activate_taxi: "Taksi aktif edildi",
  deactivate_taxi: "Taksi pasife alındı",
  bulk_activate: "Toplu aktif etme",
  bulk_deactivate: "Toplu pasife alma",
  bulk_delete: "Toplu silme",
  approve_review: "Yorum onaylandı",
  delete_review: "Yorum silindi",
};

export default async function AdminAuditLogPage() {
  const entries = await getAuditLog();

  return (
    <div className="py-6">
      <h1 className="font-display text-xl font-semibold">İşlem geçmişi</h1>
      <p className="text-sm text-muted-foreground">
        Son {entries.length} işlem
      </p>

      {entries.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Henüz kayıt yok.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <div>
                <span className="font-medium">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                <span className="ml-2 text-muted-foreground">
                  {entry.actor_email}
                </span>
              </div>
              <time
                dateTime={entry.created_at}
                className="text-xs text-muted-foreground"
              >
                {new Date(entry.created_at).toLocaleString("tr-TR")}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
