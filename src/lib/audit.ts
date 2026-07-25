import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AuditLogEntry = {
  id: string;
  actor_email: string;
  action: string;
  taxi_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export async function getAuditLog(limit = 100): Promise<AuditLogEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as AuditLogEntry[];
}

export type AuditAction =
  | "login_failed"
  | "create_taxi"
  | "update_taxi"
  | "delete_taxi"
  | "activate_taxi"
  | "deactivate_taxi"
  | "bulk_activate"
  | "bulk_deactivate"
  | "bulk_delete"
  | "approve_review"
  | "delete_review";

/**
 * Best-effort audit trail. Failures are swallowed (logged to stderr) so a
 * write to `admin_audit_log` never blocks the underlying admin action.
 */
export async function logAudit(
  actorEmail: string,
  action: AuditAction,
  options: { taxiId?: string; meta?: Record<string, unknown> } = {},
): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("admin_audit_log").insert({
      actor_email: actorEmail,
      action,
      taxi_id: options.taxiId ?? null,
      meta: options.meta ?? null,
    });
    if (error) throw error;
  } catch (err) {
    console.error("audit log write failed:", err);
  }
}
